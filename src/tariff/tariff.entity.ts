import { BaseEntity } from 'src/utilities/base.entity'
import { Column, Entity } from 'typeorm'

export enum Subnet {
  TwentyNine = 29,
  ThirtyTwo = 32,
  FortyEight = 48,
}

export enum ProxyType {
  IPV6 = 'ipv6',
  IPV4 = 'ipv4',
}

export enum SubProxyType {
  Rotation = 'Ротация',
  Static = 'Статичный',
}

@Entity('tariff')
export class TariffEntity extends BaseEntity {
  @Column({ type: 'enum', enum: ProxyType })
  proxyType: ProxyType

  @Column({ type: 'enum', enum: SubProxyType })
  subProxyType: SubProxyType

  @Column()
  name: string

  @Column({ type: 'int64' })
  threadLimit: number

  @Column({ type: 'int64' })
  rotatePeriodSec: number

  @Column({ type: 'enum', enum: Subnet })
  subnet: Subnet

  @Column()
  currencyName: string

  @Column({ type: 'int64' })
  price: number
}
