import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator'
import { Subnet } from 'src/tariff/tariff.entity'

export class CreateOrderDto {
  @IsNotEmpty()
  typeProxy: string

  @IsNotEmpty()
  nameProxy: string

  @IsNumber()
  threadLimit: number

  @IsNumber()
  rotatePeriodSec: number

  @IsEnum(Subnet)
  subnet: Subnet

  @IsNotEmpty()
  country: string

  @IsNumber()
  ttlSec: number

  @IsNumber()
  amount: number
}
