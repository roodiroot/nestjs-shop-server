import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
  Put,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { ProductDto, UpdateDescDTO, UpdateDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PaginDocumentDto } from './dto/pagin-document';
import { JwtAuthGuard } from 'src/user/jwt-auth.guard';
import { Request } from 'express';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  // ================ создание продукта =================================
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'imges', maxCount: 7 },
      { name: 'logo', maxCount: 1 },
    ]),
  )
  @Post()
  creatProduct(
    @Body() productDto: ProductDto,
    @UploadedFiles()
    files: { imges: Express.Multer.File[]; logo: Express.Multer.File },
  ) {
    return this.productService.create(productDto, files);
  }
  // ================ изменение продукта IMG =================================
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'imges', maxCount: 7 },
      { name: 'logo', maxCount: 1 },
    ]),
  )
  @Put()
  updateProduct(
    @Body() dto: UpdateDto,
    @UploadedFiles()
    files: { imges: Express.Multer.File[]; logo: Express.Multer.File },
  ) {
    return this.productService.update(dto, files);
  }

  // =================== ИЗМЕНЕНИЕ ОСНОВНЫХ ХАРАКТЕРИСТИК ПРОДУКТА ===============
  @UseGuards(JwtAuthGuard)
  @Put('change')
  changeProduct(@Body() dto: UpdateDto) {
    return this.productService.updateMainProd(dto);
  }

  // =================== ИЗМЕНЕНИЕ DESCRIPTIONS ПРОДУКТА ===============
  @UseGuards(JwtAuthGuard)
  @Put('change/descriptions')
  changeDescriptionsProduct(@Body() dto: UpdateDescDTO) {
    return this.productService.updateDescriptionsProd(dto);
  }
  // =================== УДАЛЕНИЕ ПРОДУКТА ===============
  @UseGuards(JwtAuthGuard)
  @Delete('destroy/:id')
  destroyProduct(@Param() params) {
    return this.productService.dropProduct(params.id);
  }

  // ================ вывод всего списка продуктов =======================
  @Post('pagin')
  getAllProducts(@Body() dto: PaginDocumentDto) {
    return this.productService.getAllProducts(dto);
  }
  // ================ вывод запроса поиска =======================
  @Get('search')
  getAllProductsSearch(@Req() req: Request) {
    const { search } = req.query;
    return this.productService.getAllProductsSearch(search);
  }

  // ================ вывод одного конкретного продукта ==================
  @Get(':id')
  getTest(@Param() params) {
    return this.productService.getOne(params.id);
  }
}
