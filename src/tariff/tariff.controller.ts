import { Controller } from '@nestjs/common'
import {
  Body,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common/decorators'
import { HttpStatus } from '@nestjs/common/enums'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { Roles } from 'src/user/user.entity'
import { CreateTariffDto } from './dtos/create-tariff.dto'
import { GetTariffSumInDollarsDto } from './dtos/get-sum-in-dollars.dto'
import { TariffService } from './tariff.service'

@Controller('tariff')
export class TariffController {
  constructor(private readonly tariffService: TariffService) {}

  @HttpCode(HttpStatus.OK)
  @Auth(Roles.PARTNER)
  @Post()
  public async createTariff(@Body() createTariffDto: CreateTariffDto) {
    return await this.tariffService.create(createTariffDto)
  }

  @HttpCode(HttpStatus.OK)
  @Auth()
  @Patch()
  public async getSumInDollars(
    @Body() getSumInDollarsDto: GetTariffSumInDollarsDto,
  ) {
    return await this.tariffService.getSumInDollars(getSumInDollarsDto)
  }

  @HttpCode(HttpStatus.OK)
  @Auth()
  @Get(':name?')
  public async getAll(@Param('name') name?: string) {
    return await this.tariffService.getAll(name)
  }
}
