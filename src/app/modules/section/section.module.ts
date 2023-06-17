import { Module } from '@nestjs/common';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from '../authentication/authentication.module';
import { Section } from '@infra/database/entities/section/section.entity';
import { Video } from '@infra/database/entities/section/video.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Section, Video]), AuthenticationModule],
  controllers: [SectionController],
  providers: [SectionService],
})
export class SectionModule {}
