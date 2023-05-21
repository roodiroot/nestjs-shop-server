import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Description } from 'src/description/model/description.model';
import { ProductDto, UpdateDescDTO, UpdateDto } from './dto/create-product.dto';
import { Products } from './models/products.model';
import { FilesService } from 'src/files/files.service';
import { DescriptionService } from 'src/description/description.service';
import { CreateDescriptonDto } from 'src/description/dto/create-description.dto';
import { PaginDocumentDto } from './dto/pagin-document';
import { Op } from 'sequelize';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Description) private descrRepository: typeof Description,
    @InjectModel(Products)
    private prodRepository: typeof Products,
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
          try {
            const payload: CreateDescriptonDto = {
              productId: product.id,
              title: el.title,
              description: el.description,
            };
            this.descriptionService.create(payload);
          } catch (error) {
            throw new HttpException(
              'не верный формат загруженных файлов в карусель',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }
        });
      }
      return product;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'ошибка при загрузке файлов...',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(dto: UpdateDto, file: any) {
    try {
      if (file.logo && file.imges) {
        const { logoName, imgesArray } = await this.fileService.createFile(
          file,
        );
        const product = this.prodRepository.update(
          { imges: imgesArray, logo: logoName },
          { where: { id: dto.id } },
        );
        return product;
      }
    } catch (error) {
      throw new HttpException(
        'ошибка при изменении картинок в товаре',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateMainProd(dto) {
    const { id, ...result } = dto;
    try {
      await this.prodRepository.update(
        { ...result },
        { where: { id: dto.id } },
      );
      return { message: 'success' };
    } catch (error) {
      throw new Error('ошибка изменения информацц о продукте!!!');
    }
  }

  async updateDescriptionsProd(dto: any) {
    try {
      // ОБНОВЛЕНИЕ ИНФОРМАЦИИ
      if (dto.updateInfo.length) {
        await dto.updateInfo.forEach((i) => {
          try {
            this.descrRepository.update(
              { title: i.title, description: i.description },
              { where: { id: i.id } },
            );
          } catch (error) {
            console.log(error);
            throw new Error('ошибка ОБНОВЛЕНИЕ ИНФОРМАЦИИ');
          }
        });
      }
      // ДОБОВЛЕНИЕ ИНФОРМАЦИИ
      if (dto.newInfo.length) {
        await dto.newInfo.forEach((i) => {
          try {
            const payload: CreateDescriptonDto = {
              productId: Number(i.productId),
              title: i.title.trim(),
              description: i.description.trim(),
            };
            this.descriptionService.create(payload);
          } catch (error) {
            console.log(error);
            throw new Error('ошибка ДОБОВЛЕНИЕ ИНФОРМАЦИИ');
          }
        });
      }
      // УДАЛЕНИЕ ИНФОРМАЦИИ
      if (dto.dropRow.length) {
        try {
          await dto.dropRow.forEach((i: number) => {
            this.descriptionService.destroy(i);
          });
        } catch (error) {
          console.log(error);
          throw new Error('ошибка УДАЛЕНИЕ ИНФОРМАЦИИ');
        }
      }
      return { message: 'success' };
    } catch (error) {
      console.log(error);
      throw new Error('ошибка загрузки данных общая');
    }
  }

  async getAllProducts(dto: PaginDocumentDto) {
    try {
      const filters = dto?.filtering;
      const brandId = filters?.brandId;
      const typeId = filters?.typeId;
      const limit = filters?.limit;
      const offset = filters?.offset;
      const order = filters?.order;
      const BETWEENprice = filters?.between; // [100, 30000]

      let options: any = { where: {} };

      // ЕСЛИ ПРИШЛИ ФИЛЬТРЫ В МАССИВЕ "descriptionFilters"
      if (filters?.descriptionFilters?.length) {
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
            descriprion[Op.or].push({ [Op.iLike]: `${l}%` });
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
      if (BETWEENprice) options.where.price = { [Op.between]: BETWEENprice };
      const { count } = await this.prodRepository.findAndCountAll(options);
      options.include = { all: true };
      const data = await this.prodRepository.findAll(options);
      return { count, rows: data };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'ошибка в фильте товаров',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllProductsSearch(search: any) {
    if (!search.length || search.length < 3) {
      throw new HttpException(
        'введите не менее 3х символов для поиска',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const resultSearchName = await this.prodRepository.findAndCountAll({
      where: {
        name: { [Op.iLike]: `%${search}%` },
      },
    });
    const resultSearchVendorcode = await this.prodRepository.findAndCountAll({
      where: {
        vendorcode: { [Op.iLike]: `%${search}%` },
      },
    });
    const count = resultSearchName.count + resultSearchVendorcode.count;
    const result = [...resultSearchName.rows, ...resultSearchVendorcode.rows];
    const rows = [...new Set([...result])];

    return { count, rows };
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

  async dropProduct(id: number) {
    try {
      if (isNaN(Number(id))) {
        throw new Error();
      }
      await this.descrRepository.destroy({ where: { productId: id } });
      await this.prodRepository.destroy({ where: { id } });
      return { message: `товар с id ${id} успешно удален` };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'id - должно быть числом',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
