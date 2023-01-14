import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CurrencyService } from 'src/currency/currency.service'
import { UserEntity } from 'src/user/user.entity'
import { Repository } from 'typeorm'
import { ChangeOrderCurrencyDto } from './dto/change-currency.dto'
import { CreateOrderDto } from './dto/create-order.dto'
import { OrderEntity } from './order.entity'

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly currencyService: CurrencyService,
  ) {}

  public async createOrder(createOrderDto: CreateOrderDto, user: UserEntity) {
    const newOrder = await this.orderRepository.create({
      ...createOrderDto,
      user: user,
    })

    return await this.orderRepository.save(newOrder)
  }

  public async changeCurrency(changeOrderCurrencyDto: ChangeOrderCurrencyDto) {
    const order = await this.getById(changeOrderCurrencyDto.orderId)

    return await this.orderRepository.update(
      { id: order.id },
      {
        amount: await this.currencyService.changeCurrency(
          order.amount,
          order.currency,
          changeOrderCurrencyDto.currencyName,
        ),
        currency: changeOrderCurrencyDto.currencyName,
      },
    )
  }

  public async getById(id: string) {
    return await this.orderRepository.findOneBy({ id })
  }
}
