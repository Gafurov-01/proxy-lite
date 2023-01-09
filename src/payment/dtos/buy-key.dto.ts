import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { Subnet } from 'src/tariff/tariff.entity'

export class BuyKeyDto {
  @IsNotEmpty()
  @IsNumber()
  threadLimit: number

  @IsNotEmpty()
  @IsNumber()
  rotatePeriodSec: number

  @IsNotEmpty()
  @IsEnum(Subnet)
  subnet: Subnet

  @IsNotEmpty()
  @IsString()
  serverTag: string

  @IsNotEmpty()
  @IsNumber()
  ttlSec: number
}
