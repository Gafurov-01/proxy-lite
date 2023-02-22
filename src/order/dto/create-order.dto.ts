import { IsEnum, IsNumber, IsOptional } from 'class-validator'
import { Subnet } from 'src/tariff/tariff.entity'

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
  country?: string

  @IsNumber()
  @IsOptional()
  ttlSec?: number

  @IsNumber()
  amount: number
}
