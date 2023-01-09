import { Controller } from '@nestjs/common';
import { TariffService } from './tariff.service';

@Controller('tariff')
export class TariffController {
  constructor(private readonly tariffService: TariffService) {}
}
