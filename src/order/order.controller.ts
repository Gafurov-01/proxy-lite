import { Controller } from '@nestjs/common'
import { Body, HttpCode, Patch, Post } from '@nestjs/common/decorators'
import { HttpStatus } from '@nestjs/common/enums'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/user/decorators/user.decorator'
import { UserEntity } from 'src/user/user.entity'
import { ChangeOrderCurrencyDto } from './dto/change-currency.dto'
import { CreateOrderDto } from './dto/create-order.dto'
import { OrderService } from './order.service'

@Auth()
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  public async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.orderService.createOrder(createOrderDto, user)
  }

  @HttpCode(HttpStatus.OK)
  @Patch()
  public async changeCurrency(
    @Body() changeOrderCurrencyDto: ChangeOrderCurrencyDto,
  ) {
    return await this.orderService.changeCurrency(changeOrderCurrencyDto)
  }
}
