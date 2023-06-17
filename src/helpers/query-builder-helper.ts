import { Repository, SelectQueryBuilder } from 'typeorm';
import { Progress } from '@infra/database/entities/profile/progress.entity';

export class QueryBuilderHelper<T> {
  private constructor(
    private readonly alias: string,
    private query: SelectQueryBuilder<T>,
  ) {}

  static create<T>(repository: Repository<T>): QueryBuilderHelper<T> {
    return new QueryBuilderHelper(
      repository.metadata.name.toLowerCase(),
      repository.createQueryBuilder(repository.metadata.name.toLowerCase()),
    );
  }

  addProgress(profileId: number | undefined, alias = this.alias): this {
    const entityType =
      { sections: 'section', classes: 'class', modules: module }[alias] ||
      alias;
    const pAlias = alias + 'Progress';
    this.query.leftJoinAndMapMany(
      `${alias}.progresses`,
      Progress,
      pAlias,
      `${pAlias}.entityId = ${alias}.id AND ${pAlias}.entityType = '${entityType}'` +
        (profileId ? `AND ${pAlias}.profileId = ${profileId}` : ''),
    );
    return this;
  }

  filterEq(field: string, value: string) {
    if (!value) return this;
    const [alias, fieldName] = field.includes('.')
      ? field.split('.')
      : [this.alias, field];
    this.query.andWhere(`${alias}.${fieldName} = :${fieldName}`, {
      [fieldName]: value,
    });

    return this;
  }

  filterLike(field: string, value: string) {
    if (!value) return this;
    const [alias, fieldName] = field.includes('.')
      ? field.split('.')
      : [this.alias, field];
    this.query.andWhere(`${alias}.${fieldName} LIKE :${fieldName}`, {
      [fieldName]: `%${value}%`,
    });
    return this;
  }

  filterLikeWords(field: string, value: string) {
    if (!value) return this;
    const [alias, fieldName] = field.includes('.')
      ? field.split('.')
      : [this.alias, field];
    const words = value.split(' ');
    words.forEach((word) => {
      this.query.andWhere(`${alias}.${fieldName} LIKE :${fieldName}`, {
        [fieldName]: `%${word}%`,
      });
    });
    return this;
  }

  getQuery() {
    return this.query;
  }

  addRelations(relations: string[], profileId?: number) {
    relations.forEach((relation) => {
      this.query.leftJoinAndSelect(`${this.alias}.${relation}`, relation);
      if (['sections', 'classes', 'modules'].includes(relation)) {
        this.query.loadRelationCountAndMap(
          `${this.alias}.${relation}Count`,
          `${this.alias}.${relation}`,
        );
        if (profileId) {
          this.addProgress(profileId, relation);
        }
      }
    });
    return this;
  }
}
