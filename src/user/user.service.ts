import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AuthDto } from 'src/auth/dtos/auth.dto'
import { Repository } from 'typeorm'
import { UserEntity } from './user.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async createUser(authDto: AuthDto) {
    const newUser = await this.userRepository.create({
      email: authDto.email,
    })

    return await this.userRepository.save(newUser)
  }

  public async markEmailAsConfirmed(id: string) {
    const user = await this.getById(id)
    user.isEmailConfirmed = true
    await this.userRepository.save(user)

    return 'Вы успешно подтвердили свою почту'
  }

  public async getByEmail(email: string) {
    return await this.userRepository.findOneBy({ email })
  }

  public async getById(id: string) {
    return await this.userRepository.findOneBy({ id })
  }

  public async save(user: UserEntity) {
    await this.userRepository.save(user)
  }
}
