import { IsNotEmpty } from 'class-validator'

export class ChangeOrderCurrencyDto {
  @IsNotEmpty()
  currencyName: string

  @IsNotEmpty()
  orderId: string
}
