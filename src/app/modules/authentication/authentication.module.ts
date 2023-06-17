import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Profile } from '@infra/database/entities/profile/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile]),
    JwtModule.register({
      secret: 'ssshhhh',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  exports: [JwtModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthenticationModule {}
