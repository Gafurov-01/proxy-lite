import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator'
import { MethodType } from '../methods/payment-method.entity'

export class CreatePaymentDto {
  @IsEnum(MethodType)
  method: MethodType

  @IsUUID()
  @IsNotEmpty()
  orderId: string
}
