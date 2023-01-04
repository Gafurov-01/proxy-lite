import { UseGuards } from '@nestjs/common'
import { JwtGuard } from '../guards/jwt.guard'

export const Auth = () => UseGuards(JwtGuard)
