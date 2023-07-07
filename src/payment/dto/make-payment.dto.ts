import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class MakePaymentDto {
  @ApiProperty({ example: 200 })
  @IsNotEmpty()
  amount: number;
}
