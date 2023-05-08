import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Description } from 'src/description/model/description.model';
import { ProductDto, UpdateDto } from './dto/create-product.dto';
import { Products } from './models/products.model';
import { FilesService } from 'src/files/files.service';
import { DescriptionService } from 'src/description/description.service';
import { CreateDescriptonDto } from 'src/description/dto/create-description.dto';
import { PaginDocumentDto } from './dto/pagin-document';
import { FindOptions, Op, WhereOptions } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { filter } from 'rxjs';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Description) private descrRepository: typeof Description,
    @InjectModel(Products) private prodRepository: typeof Products,
    private fileService: FilesService,
    private descriptionService: DescriptionService,
  ) {}

  async create(productDto: ProductDto, files: any) {
    try {
      if (
        files.logo[0].mimetype !== 'image/jpeg' &&
        files.logo[0].mimetype !== 'image/jpg' &&
        files.logo[0].mimetype !== 'image/png' &&
        files.logo[0].mimetype !== 'image/webp'
      ) {
        throw new HttpException(
          'не верный формат загруженных файлов в логотип',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      for (let i = 0; i < files.imges.length; i++) {
        if (
          files.imges[i].mimetype !== 'image/jpeg' &&
          files.imges[i].mimetype !== 'image/jpg' &&
          files.imges[i].mimetype !== 'image/png' &&
          files.imges[i].mimetype !== 'image/webp'
        ) {
          throw new HttpException(
            'не верный формат загруженных файлов в карусель',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }

      const { logoName, imgesArray } = await this.fileService.createFile(files);

      const product = await this.prodRepository.create({
        ...productDto,
        logo: logoName,
        imges: imgesArray,
      });

      if (productDto.descriptions) {
        const info = JSON.parse(productDto.descriptions);
        await info.forEach((el) => {
          const payload: CreateDescriptonDto = {
            productId: product.id,
            title: el.title,
            description: el.description,
          };
          this.descriptionService.create(payload);
        });
      }

      return product;
    } catch (error) {
      throw new HttpException(
        'ошибка при загрузке файлов...',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(dto: UpdateDto, file: any) {
    console.log(dto.id);
    if (file.logo && file.imges) {
      const { logoName, imgesArray } = await this.fileService.createFile(file);
      const product = this.prodRepository.update(
        { imges: imgesArray, logo: logoName },
        { where: { id: dto.id } },
      );
      return product;
    }
  }

  async fetchAll(dto: PaginDocumentDto) {
    try {
      const filters: any = dto.filtering;
      let productIdArray = [];
      let options: FindOptions<Products> = { include: { all: true } };

      if (filters.descriptionFilters.length) {
        // ЕСЛИ ФИЛЬТР ИЗ ТАБЛИЦЫ DESCRIPTION ПРИХОДЯТ НЕСКОЛЬКО
        if (filters.descriptionFilters.length > 1) {
          console.log(`несколько фильтров`);
          const params = filters.descriptionFilters.map((i) => ({
            title: { [Op.iLike]: `${i.title}%` },
            description: { [Op.iLike]: `${i.description[0]}%` },
          }));

          // { [Op.iLike]: `${i.description}%` }

          const descriptions = await this.descrRepository.findAll({
            attributes: ['productId'],
            where: {
              [Op.or]: params,
            },
          });

          const productsIdList = descriptions.map((i) => i.productId);

          const result = productsIdList.reduce((acc, el) => {
            acc[el] = (acc[el] || 0) + 1;
            return acc;
          }, {});

          for (let key in result) {
            if (result[key] === 2) {
              productIdArray.push(Number(key));
            }
          }
          // ЕСЛИ ФИЛЬТР ИЗ ТАБЛИЦЫ DESCRIPTION ПРИХОДЕТ ОДИН
        } else {
          console.log(`один фильтр`);
          const options = {
            title: { [Op.iLike]: `${filters.descriptionFilters[0].title}%` },
            description: {
              [Op.iLike]: `${filters.descriptionFilters[0].description[0]}%`,
            },
          };

          console.log(options);
          const descriptions = await this.descrRepository.findAll({
            attributes: ['productId'],
            where: options,
          });

          productIdArray = descriptions.map((i) => i.productId);
        }
        if (!productIdArray.length) {
          options.where = [{ id: 0 }];
        }
        options.where = [{ ...options.where, id: productIdArray }];
      }

      const products = this.prodRepository.findAll(options);

      return products;
    } catch (error) {}
    return { message: 'Ошибка во время обращения к базе!' };
  }

  async getAllProducts(dto: PaginDocumentDto) {
    try {
      const filters = dto.filtering;
      const brandId = filters.brandId;
      const typeId = filters.typeId;
      const limit = filters.limit;
      const offset = filters.offset;
      const order = filters.order;

      let options: any = { include: { all: true }, where: {} };

      // ЕСЛИ ПРИШЛИ ФИЛЬТРЫ В МАССИВЕ "descriptionFilters"
      if (filters?.descriptionFilters.length || !filters.descriptionFilters) {
        let productIdArray = [];
        let descriptionsFilterList = {
          attributes: ['productId'],
          where: { [Op.or]: [] },
        };

        for (let i = 0; i < filters.descriptionFilters.length; i++) {
          let filterOneObj = { title: {}, description: {} };
          const title = filters.descriptionFilters[i].title;
          let descriprion = { [Op.or]: [] };
          filters.descriptionFilters[i].description.map((l) => {
            descriprion[Op.or].push({ [Op.iLike]: `${l}` });
          });
          filterOneObj.title = { [Op.iLike]: `${title}%` };
          filterOneObj.description = descriprion;

          descriptionsFilterList.where[Op.or].push(filterOneObj);
        }

        const descriptions = await this.descrRepository.findAll(
          descriptionsFilterList,
        );

        if (filters.descriptionFilters.length === 1) {
          productIdArray = descriptions.map((i) => i.productId);
        } else {
          const dublicateList = descriptions.map((i) => i.productId);
          const result = dublicateList.reduce((acc, el) => {
            acc[el] = (acc[el] || 0) + 1;
            return acc;
          }, {});

          for (let key in result) {
            if (result[key] === filters.descriptionFilters.length) {
              productIdArray.push(Number(key));
            }
          }
        }
        options.where.id = productIdArray;
      }

      options.limit = limit || 5;
      options.offset = offset || 0;
      options.order = order || [['price', 'ASC']];
      if (Number(brandId)) options.where.brandId = brandId;
      if (Number(typeId)) options.where.typeId = typeId;

      const products = this.prodRepository.findAndCountAll(options);
      return products;
    } catch (error) {
      return error;
    }
  }

  async getOne(id: number) {
    try {
      const product = await this.prodRepository.findOne({
        where: { id },
        include: { all: true },
      });
      const views = product.numberOfViews + 1;
      await this.prodRepository.update(
        { numberOfViews: views },
        { where: { id: product.id } },
      );
      return product;
    } catch (error) {
      return error;
    }
  }
}

// ПРИМЕР ОБЪЕКТА DTO который приходит от клиента
// {
//   filtering: {
//     brandId: 6,
//     typeId: 3,
//     descriptionFilters: [
//       { title: "Площадь помещения: м².", description: ["20"] },
//       { title: "Мин. температура за окном", description: ["-15 С"] },
//       { title: "Цвет", description: ["черный"] },
//       {
//         title: "Тип компрессора:",
//         description: ["инвертор", "не инвертор"],
//       },
//       { title: "Площадь помещения: м².", description: ["25", "35"] },
//       { title: "Наличие WiFi:", description: ["нет"] },
//       { title: "Класс энегроэффективности:", description: ["A++/A+"] },
//     ],
//   },
// }
