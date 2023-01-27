import { Controller } from '@nestjs/common'
import { Body, HttpCode, Post } from '@nestjs/common/decorators'
import { HttpStatus } from '@nestjs/common/enums'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/user/decorators/user.decorator'
import { UserEntity } from 'src/user/user.entity'
import { CreatePaymentDto } from './dtos/create-payment.dto'
import { PaymentService } from './payment.service'

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @HttpCode(HttpStatus.OK)
  @Auth()
  @Post()
  public async createPayment(
    @Body() createPaymentDto: CreatePaymentDto,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.paymentService.createPayment(createPaymentDto, user)
  }
}
