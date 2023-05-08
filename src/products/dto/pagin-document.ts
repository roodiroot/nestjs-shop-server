import { ProductDto } from './create-product.dto';

export class FilterDescriptionElementDTO {
  title: string;
  description: [string];
}

export class FilteringDTO {
  descriptionFilters: [FilterDescriptionElementDTO] | undefined;
  brandId: number;
  typeId: number;
  limit: number;
  offset: number;
  order: [any];
}

export class PaginDocumentDto {
  filtering: FilteringDTO;
}
