import { IsArray, IsNotEmpty, IsUUID } from 'class-validator'

export class ChangeOrderCurrencyDto {
  @IsNotEmpty()
  currencyName: string

  @IsUUID()
  @IsArray({ each: true })
  orderIds: string[]
}
