import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TariffController } from './tariff.controller'
import { TariffEntity } from './tariff.entity'
import { TariffService } from './tariff.service'

@Module({
  imports: [TypeOrmModule.forFeature([TariffEntity])],
  controllers: [TariffController],
  providers: [TariffService],
})
export class TariffModule {}
