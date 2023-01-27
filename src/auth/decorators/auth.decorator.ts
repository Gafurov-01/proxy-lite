import { UseGuards } from '@nestjs/common'
import { Roles } from 'src/user/user.entity'
import { AdminGuard } from '../guards/admin.guard'
import { JwtGuard } from '../guards/jwt.guard'
import { PartnerGuard } from '../guards/partner.guard'

export const Auth = (role?: Roles) => {
  if (role) {
    if (role === Roles.ADMIN) {
      return UseGuards(JwtGuard, AdminGuard)
    } else if (role === Roles.PARTNER) {
      return UseGuards(JwtGuard, PartnerGuard)
    }
  } else {
    return UseGuards(JwtGuard)
  }
}
