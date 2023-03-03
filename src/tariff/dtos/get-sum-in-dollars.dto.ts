import { IsArray, IsUUID } from 'class-validator'

export class GetTariffSumInDollarsDto {
  @IsArray({ each: true })
  @IsUUID()
  tariffIds: string[]
}
