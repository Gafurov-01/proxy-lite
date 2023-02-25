import { Controller } from '@nestjs/common'
import { Body, Delete, HttpCode, Patch, Post } from '@nestjs/common/decorators'
import { HttpStatus } from '@nestjs/common/enums'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/user/decorators/user.decorator'
import { UserEntity } from 'src/user/user.entity'
import { CreatePaymentDto } from './dtos/create-payment.dto'
import { RefundPaymentDto } from './dtos/refund-payment.dto'
import { ReplenishBalanceDto } from './dtos/replenish-balance.dto'
import { PaymentService } from './payment.service'

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  @Auth()
  public async createPayment(
    @Body() createPaymentDto: CreatePaymentDto,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.paymentService.buyOrders(createPaymentDto, user)
  }

  @HttpCode(HttpStatus.OK)
  @Delete()
  @Auth()
  public async refundPayment(@Body() refundPaymentDto: RefundPaymentDto) {
    await this.paymentService.refundPayment(refundPaymentDto)
  }

  @HttpCode(HttpStatus.OK)
  @Patch()
  @Auth()
  public async replenishBalance(
    @Body() replenishBalanceDto: ReplenishBalanceDto,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.paymentService.replenishBalance(replenishBalanceDto, user)
  }
}
