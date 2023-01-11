import { BaseEntity } from 'src/utilities/base.entity'
import { Column, Entity } from 'typeorm'

@Entity('currencies')
export class CurrencyEntity extends BaseEntity {
  @Column()
  name: string

  @Column({ type: 'decimal' })
  currencyRate: number

  @Column()
  symbol: string
}
