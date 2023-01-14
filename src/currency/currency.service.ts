import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CurrencyEntity } from './currency.entity'

@Injectable()
export class CurrencyService {
  constructor(
    @InjectRepository(CurrencyEntity)
    private readonly currencyRepository: Repository<CurrencyEntity>,
  ) {}

  public async changeCurrency(amount: number, from: string, to: string) {
    const toCurrency = await this.getByName(to)
    const fromCurrency = await this.getByName(from)

    if (from !== 'RUB' && to !== 'RUB') {
      amount = this.convertToRub(amount, fromCurrency)

      return (amount /= toCurrency.currencyRate)
    } else if (from === 'RUB') {
      return (amount /= toCurrency.currencyRate)
    } else if (to === 'RUB') {
      return this.convertToRub(amount, fromCurrency)
    }
  }

  public async getAll() {
    return await this.currencyRepository.find()
  }

  private async getByName(name: string) {
    return await this.currencyRepository.findOneBy({ name })
  }

  private convertToRub(amount: number, from: CurrencyEntity) {
    return (amount *= from.currencyRate)
  }
}
