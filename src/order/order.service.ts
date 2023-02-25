import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CurrencyService } from 'src/currency/currency.service'
import { UserEntity } from 'src/user/user.entity'
import { In, Repository } from 'typeorm'
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

  public async changeCurrency({
    orderIds,
    currencyName,
  }: ChangeOrderCurrencyDto) {
    const orders = await this.getByIds(orderIds)

    for (let order of orders) {
      order.price = await this.currencyService.changeCurrency(
        order.price,
        order.currency,
        currencyName,
      )
      order.currency = currencyName
      await this.orderRepository.save(order)
    }

    return await this.getByIds(orderIds)
  }

  public async getById(id: string) {
    return await this.orderRepository.findOneBy({ id })
  }

  public async getByIds(ids: string[]) {
    return await this.orderRepository.find({
      where: {
        id: In(ids),
      },
    })
  }

  public getOrdersSum(orders: OrderEntity[]) {
    return orders.reduce((accumulator, order) => accumulator + order.price, 0)
  }
}
