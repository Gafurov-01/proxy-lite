import { IsEnum, IsNumber, IsOptional } from 'class-validator'
import { ProxyType, Subnet, SubProxyType } from 'src/tariff/tariff.entity'
import { Country } from '../order.entity'

export class CreateOrderDto {
  @IsOptional()
  typeProxy?: ProxyType

  @IsOptional()
  subProxyType?: SubProxyType

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
  price: number
}
