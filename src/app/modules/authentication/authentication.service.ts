import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthenticationDto } from './dto/create-authentication.dto';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from '@infra/database/entities/profile/profile.entity';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(Profile)
    private readonly repository: Repository<Profile>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createAuthenticationDto: CreateAuthenticationDto) {
    const user = await this.repository
      .findOneByOrFail({
        email: createAuthenticationDto.email,
      })
      .catch(() => {
        throw new UnauthorizedException();
      });

    if (user.password !== createAuthenticationDto.password) {
      throw new UnauthorizedException();
    }

    const payload = { username: user.email, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async update(id: number) {
    const user = await this.repository.findOneByOrFail({ id });
    return {
      access_token: jwt.sign({ id: user.id }, 'sshhhhh', { expiresIn: '1d' }),
    };
  }
}
