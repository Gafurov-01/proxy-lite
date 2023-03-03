import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrencyService } from './currency.service'

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  @Auth()
  public async getAll() {
    return await this.currencyService.getAll()
  }
}
