import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from 'src/user/user.entity'
import { UserService } from 'src/user/user.service'
import { Repository } from 'typeorm'
import { CreateOrderDto } from './dto/create-order.dto'
import { OrderEntity } from './order.entity'

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly userService: UserService,
  ) {}

  public async createOrder(createOrderDto: CreateOrderDto, user: UserEntity) {
    const newOrder = await this.orderRepository.create({
      typeProxy: createOrderDto.typeProxy,
      nameProxy: createOrderDto.nameProxy,
      threadLimit: createOrderDto.threadLimit,
      rotatePeriodSec: createOrderDto.rotatePeriodSec,
      subnet: createOrderDto.subnet,
      country: createOrderDto.country,
      ttlSec: createOrderDto.ttlSec,
      price: createOrderDto.price,
      user: user,
    })

    return await this.orderRepository.save(newOrder)
  }

  public async getById(id: number) {
    return await this.orderRepository.findOneBy({ id })
  }
}
