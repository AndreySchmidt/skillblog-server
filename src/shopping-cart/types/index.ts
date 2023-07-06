import { ApiProperty } from '@nestjs/swagger';

class ShoppingCartItem {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Some Name' })
  name: string;

  @ApiProperty({ example: 12 })
  price: number;

  @ApiProperty({
    example: 'https://loremflicr.com/640/480/technics?random=84959846502943',
  })
  image: string;

  @ApiProperty({ example: 5 })
  in_stock: number;

  @ApiProperty({ example: 'Google' })
  parts_manufacturer: string;

  @ApiProperty({ example: 'Bosh' })
  boiler_manufacturer: string;

  @ApiProperty({ example: 10 })
  userId: number;

  @ApiProperty({ example: 17 })
  partId: number;

  @ApiProperty({ example: 2 })
  count: number;

  @ApiProperty({ example: 2454 })
  total_price: number;

  @ApiProperty({ example: '2021-02-16T12:32:33.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2021-02-16T12:32:33.000Z' })
  updatedAt: string;
}

export class GetAllResponse extends ShoppingCartItem {}

export class AddToCartResponse extends ShoppingCartItem {}

export class UpdateCountResponse {
  @ApiProperty({ example: 3 })
  count: number;
}

export class UpdateCountRequest {
  @ApiProperty({ example: 3 })
  count: number;
}

export class TotalPriceResponse {
  @ApiProperty({ example: 45 })
  total_price: number;
}

export class TotalPriceRequest {
  @ApiProperty({ example: 45 })
  total_price: number;
}
