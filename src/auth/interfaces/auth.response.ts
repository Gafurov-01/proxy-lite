import { UserEntity } from 'src/user/user.entity'

export interface AuthResponse extends UserEntity {
  accessToken: string
}
