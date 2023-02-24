import { IsEnum, IsNumber, IsOptional } from 'class-validator'
import { Subnet } from 'src/tariff/tariff.entity'
import { Country } from '../order.entity'

export class CreateOrderDto {
  @IsOptional()
  typeProxy?: string

  @IsOptional()
  nameProxy?: string

  @IsOptional()
  threadLimit?: number

  @IsOptional()
  rotatePeriodSec?: number

  @IsEnum(Subnet)
  @IsOptional()
  subnet?: Subnet

  @IsOptional()
  @IsEnum(Country)
  country?: Country

  @IsNumber()
  @IsOptional()
  ttlSec?: number

  @IsNumber()
  amount: number
}
