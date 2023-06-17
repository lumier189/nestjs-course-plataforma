import {
  FindManyOptions,
  FindOneOptions,
  IsNull,
  SelectQueryBuilder,
} from 'typeorm';
import { Progress } from '@infra/database/entities/profile/progress.entity';

export function addProgress(
  query: SelectQueryBuilder<any>,
  profileId: number | undefined,
) {
  query.leftJoinAndSelect(
    Progress,
    'progress',
    "progress.entityId = class.id AND progress.entityType = 'class' AND progress.profileId = :profileId",
    { profileId },
  );
  return query;
}

export function addProgressRelationship<
  T extends FindOneOptions | FindManyOptions,
>(profileId: number | undefined, entityType, options: T = {} as T): T {
  if (!options.where) options.where = {};
  if (!options.relations) options.relations = {};

  options.where = {
    ...options.where,
    ...(profileId
      ? {
          progresses: [
            { profileId: IsNull(), entityType },
            { profileId: profileId, entityType },
          ],
        }
      : {}),
    progresses: [{ profileId: IsNull() }, { profileId: profileId ?? IsNull() }],
  };
  options.relations = [
    ...(profileId ? ['progresses'] : []),
    ...(options.relations as string[]),
  ];

  return options;
}
