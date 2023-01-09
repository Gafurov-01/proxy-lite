import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export enum Subnet {
  TwentyNine = 29,
  ThirtyTwo = 32,
  FortyEight = 48,
}

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
