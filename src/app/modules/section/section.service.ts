import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Section } from '@infra/database/entities/section/section.entity';
import { Video } from '@infra/database/entities/section/video.entity';
import { QueryBuilderHelper } from '../../../helpers/query-builder-helper';

@Injectable()
export class SectionService {
  constructor(
    @InjectRepository(Section)
    private readonly repository: Repository<Section>,
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
  ) {}

  findAll(
    filters: Record<string, string> = {},
    relations: string[],
    profileId?: number,
  ) {
    return QueryBuilderHelper.create(this.repository)
      .addProgress(profileId)
      .filterEq('classId', filters?.class_id)
      .filterLikeWords('name', filters?.name)
      .addRelations(relations, profileId)
      .getQuery()
      .getMany();
  }

  findOne(id: number, profileId?: number) {
    return QueryBuilderHelper.create(this.repository)
      .addProgress(profileId)
      .filterEq('id', id.toString())
      .getQuery()
      .getOneOrFail();
  }

  async getVideo(id: number) {
    return this.videoRepository.findOneByOrFail({ id });
  }
}
