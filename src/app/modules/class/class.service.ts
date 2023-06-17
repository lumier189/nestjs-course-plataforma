import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from '@infra/database/entities/class/class.entity';
import { QueryBuilderHelper } from '../../../helpers/query-builder-helper';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private readonly repository: Repository<Class>,
  ) {}

  findAll(
    filters: Record<string, string> = {},
    relations: string[] = [],
    profileId?: number,
  ) {
    return QueryBuilderHelper.create(this.repository)
      .addProgress(profileId)
      .filterEq('moduleId', filters?.module_id)
      .filterLikeWords('name', filters?.name)
      .addRelations(relations, profileId)
      .getQuery()
      .getMany();
  }

  findOne(id: number, relations: string[] = [], profileId?: number) {
    return QueryBuilderHelper.create(this.repository)
      .addProgress(profileId)
      .filterEq('id', id.toString())
      .addRelations(relations, profileId)
      .getQuery()
      .getOneOrFail();
  }
}
