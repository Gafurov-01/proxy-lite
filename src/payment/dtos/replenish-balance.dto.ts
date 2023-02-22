import { IsEnum, IsNumber } from 'class-validator'
import { MethodType } from '../methods/payment-method.entity'

export class ReplenishBalanceDto {
  @IsNumber()
  amount: number

  @IsEnum(MethodType)
  method: MethodType
}
