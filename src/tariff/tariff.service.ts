import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateTariffDto } from './dtos/create-tariff.dto'
import { TariffEntity } from './tariff.entity'

@Injectable()
export class TariffService {
  constructor(
    @InjectRepository(TariffEntity)
    private readonly tariffRepository: Repository<TariffEntity>,
  ) {}

  public async create(createTariffDto: CreateTariffDto) {
    const newTariff = await this.tariffRepository.create(createTariffDto)

    return await this.tariffRepository.save(newTariff)
  }

  public async getAll() {
    return await this.tariffRepository.find()
  }
}
