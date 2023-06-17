import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Progress } from '@infra/database/entities/profile/progress.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Class } from '@infra/database/entities/class/class.entity';
import { Section } from '@infra/database/entities/section/section.entity';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress)
    private repository: Repository<Progress>,
    @InjectRepository(Section)
    private sectionRepository: Repository<Section>,
  ) {}

  findAll(profileId: number, entityType: string) {
    return this.repository.find({
      where: { profileId, entityType },
    });
  }

  findOne(sub, entityType: string, entityId: number) {
    return this.repository.findOneOrFail({
      where: { profileId: sub, entityType, entityId },
    });
  }

  async save(profileId: number, progress: number, entityId: number) {
    await this.insertOrUpdate(profileId, 'section', progress, entityId);
    const { classId } = await this.sectionRepository.findOneOrFail({
      where: { id: entityId },
    });
    const classSectionCount = await this.sectionRepository.count({
      where: { classId },
    });
    const classSectionProgressCount = await this.repository.count({
      where: { profileId, entityType: 'section', progress: 100 },
    });

    await this.insertOrUpdate(
      profileId,
      'class',
      (classSectionCount / classSectionProgressCount) * 100,
      classId,
    );

    // const moduleProgressCount = await this.repository.count({
    //   where: { profileId, entityType: 'class', progress: MoreThanOrEqual(100) },
    // });

    await this.insertOrUpdate(
      profileId,
      'class',
      classSectionCount / classSectionProgressCount,
      classId,
    );
  }

  private async insertOrUpdate(
    profileId: number,
    entityType: string,
    progress: number,
    entityId: number,
  ) {
    const exists = await this.repository.exist({
      where: { entityType, entityId, profileId },
    });

    if (exists) {
      return this.repository.update(
        { entityType, entityId, profileId },
        { progress },
      );
    }

    return this.repository.insert({
      progress,
      entityType,
      profileId,
      entityId,
    });
  }
}
