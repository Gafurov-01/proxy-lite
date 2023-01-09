import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { Roles } from 'src/user/user.entity'

@Injectable()
export class PartnerGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (user.role === Roles.PARTNER || user.role === Roles.ADMIN) {
      return true
    } else {
      throw new ForbiddenException(
        'Доступ запрещен, так как вы не являетесь партнером',
      )
    }
  }
}
