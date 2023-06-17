import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Progress } from '@infra/database/entities/profile/progress.entity';
import { Profile } from '@infra/database/entities/profile/profile.entity';
import { ProfileService } from './services/profile.service';
import { ProgressService } from './services/progress.service';
import { Section } from '@infra/database/entities/section/section.entity';
import { Class } from '@infra/database/entities/class/class.entity';
import { Module as ModuleEntity } from '@infra/database/entities/module/module.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: 'ssshhhh',
      signOptions: {
        expiresIn: '1d',
      },
    }),
    TypeOrmModule.forFeature([Profile, Progress, Section, Class, ModuleEntity]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService, ProgressService],
})
export class ProfileModule {}
