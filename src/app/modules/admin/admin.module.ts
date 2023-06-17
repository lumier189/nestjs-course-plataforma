import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from '@infra/database/entities/section/video.entity';
import { Module as ModuleEntity } from '@infra/database/entities/module/module.entity';
import { Class } from '@infra/database/entities/class/class.entity';
import { Section } from '@infra/database/entities/section/section.entity';
import { S3 } from '../../providers/s3/s3';

@Module({
  imports: [TypeOrmModule.forFeature([ModuleEntity, Video, Class, Section])],
  controllers: [AdminController],
  providers: [AdminService, S3],
})
export class AdminModule {}
