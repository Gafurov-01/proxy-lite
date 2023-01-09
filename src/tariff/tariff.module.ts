import { Module } from '@nestjs/common';
import { TariffService } from './tariff.service';
import { TariffController } from './tariff.controller';

@Module({
  controllers: [TariffController],
  providers: [TariffService]
})
export class TariffModule {}
