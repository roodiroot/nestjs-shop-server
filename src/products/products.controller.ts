import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  Put,
} from '@nestjs/common';
import { ProductDto, UpdateDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RoleGuard } from 'src/auth/role.guard';
import {
  FileInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { PaginDocumentDto } from './dto/pagin-document';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  // ================ создание продукта =================================
  // @Roles('ADMIN')
  // @UseGuards(RoleGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'imges', maxCount: 5 },
      { name: 'logo', maxCount: 1 },
    ]),
  )
  @Post()
  creatProduct(
    @Body() productDto: ProductDto,
    @UploadedFiles()
    files: // new ParseFilePipe({
    //   validators: [new FileTypeValidator({ fileType: 'image/jpeg' })],
    // }),
    { imges: Express.Multer.File[]; logo: Express.Multer.File },
  ) {
    return this.productService.create(productDto, files);
  }
  // ================ изменение продукта =================================
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

  // ================ вывод всего списка продуктов =======================

  @Post('pagin')
  getAllProducts(@Body() dto: PaginDocumentDto) {
    return this.productService.getAllProducts(dto);
  }

  // ================ вывод одного конкретного продукта ==================
  @Get(':id')
  getTest(@Param() params) {
    return this.productService.getOne(params.id);
  }
}
