import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CurrencyService } from 'src/currency/currency.service'
import { ILike, In, Repository } from 'typeorm'
import { CreateTariffDto } from './dtos/create-tariff.dto'
import { GetTariffSumInDollarsDto } from './dtos/get-sum-in-dollars.dto'
import { TariffEntity } from './tariff.entity'

@Injectable()
export class TariffService {
  constructor(
    @InjectRepository(TariffEntity)
    private readonly tariffRepository: Repository<TariffEntity>,
    private readonly currencyService: CurrencyService,
  ) {}

  public async create(createTariffDto: CreateTariffDto) {
    const newTariff = await this.tariffRepository.create(createTariffDto)

    return await this.tariffRepository.save(newTariff)
  }

  public async getSumInDollars({ tariffIds }: GetTariffSumInDollarsDto) {
    const tariffs = await this.byIds(tariffIds)
    let pricesInDollars: number[]

    for (let tariff of tariffs) {
      pricesInDollars.push(
        await this.currencyService.changeCurrency(
          tariff.price,
          tariff.currencyName,
          'USD',
        ),
      )
    }

    return pricesInDollars
  }

  public async getAll(name?: string) {
    return await this.tariffRepository.find({
      where: {
        name: ILike(`%${name}%`),
      },
    })
  }

  private async byIds(ids: string[]) {
    return await this.tariffRepository.find({
      where: {
        id: In(ids),
      },
    })
  }
}
