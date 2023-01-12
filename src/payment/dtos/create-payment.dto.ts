import { IsEnum, IsNumber } from 'class-validator'
import { MethodType } from '../methods/payment-method.entity'

export class CreatePaymentDto {
  @IsEnum(MethodType)
  method: MethodType

  @IsNumber()
  orderId: number
}
