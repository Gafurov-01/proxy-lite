import { BaseEntity } from 'src/utilities/base.entity'
import { Column, Entity } from 'typeorm'

@Entity('currencies')
export class CurrencyEntity extends BaseEntity {
  @Column()
  name: string

  @Column({ type: 'int64' })
  currencyRate: number

  @Column()
  symbol: string
}
