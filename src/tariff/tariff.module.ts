import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CurrencyModule } from 'src/currency/currency.module'
import { TariffController } from './tariff.controller'
import { TariffEntity } from './tariff.entity'
import { TariffService } from './tariff.service'

@Module({
  imports: [TypeOrmModule.forFeature([TariffEntity]), CurrencyModule],
  controllers: [TariffController],
  providers: [TariffService],
})
export class TariffModule {}
