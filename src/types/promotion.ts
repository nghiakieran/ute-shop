export interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  image: string;
}

export interface DiscountDetailDto {
  percentage: number;
  productID: number[];
}

export interface CreatePromotionDto {
  name: string;
  description: string;
  active: boolean;
  startDate: string;
  endDate: string;
  discountDetailDTOList: DiscountDetailDto[];
}
