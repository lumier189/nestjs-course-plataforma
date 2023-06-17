import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Module } from '@infra/database/entities/module/module.entity';
import { QueryBuilderHelper } from '../../../helpers/query-builder-helper';

@Injectable()
export class ModuleService {
  constructor(
    @InjectRepository(Module)
    private readonly repository: Repository<Module>,
  ) {}

  findAll(
    filters: Record<string, string> = {},
    relations: string[],
    profileId?: number,
  ) {
    return QueryBuilderHelper.create(this.repository)
      .addProgress(profileId)
      .filterLikeWords('name', filters?.name)
      .addRelations(relations, profileId)
      .getQuery()
      .getMany();
  }

  async findOne(id: number, relations = [], profileId?: number) {
    return QueryBuilderHelper.create(this.repository)
      .addProgress(profileId)
      .filterEq('id', id.toString())
      .addRelations(relations, profileId)
      .getQuery()
      .getOneOrFail();
  }
}
