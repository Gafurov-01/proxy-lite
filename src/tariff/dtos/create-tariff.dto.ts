import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator'
import { Subnet } from '../tariff.entity'

export class CreateTariffDto {
  @IsNotEmpty()
  typeProxy: string

  @IsNotEmpty()
  name: string

  @IsNumber()
  threadLimit: number

  @IsNumber()
  rotatePeriodSec: number

  @IsNotEmpty()
  @IsEnum(Subnet)
  subnet: Subnet

  @IsNumber()
  price: number
}