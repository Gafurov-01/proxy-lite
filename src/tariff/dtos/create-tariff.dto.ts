import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator'
import { ProxyType, Subnet, SubProxyType } from '../tariff.entity'

export class CreateTariffDto {
  @IsNotEmpty()
  @IsEnum(ProxyType)
  typeProxy: ProxyType

  @IsNotEmpty()
  @IsEnum(SubProxyType)
  subProxyType: SubProxyType

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
