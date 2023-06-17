import { HttpException, Injectable } from '@nestjs/common';
import * as fs from 'node:fs';
import { TelegramChannelData } from './interfaces/telegram-channel-data.interface';
import { PartNormalized } from './interfaces/part-normalized.interface';
import { Repository } from 'typeorm';
import { Class } from '@infra/database/entities/class/class.entity';
import { Section } from '@infra/database/entities/section/section.entity';
import { Module } from '@infra/database/entities/module/module.entity';
import { Video } from '@infra/database/entities/section/video.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from '../../providers/s3/s3';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Module)
    private readonly moduleRepository: Repository<Module>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    private readonly s3: S3,
  ) {}
  async import(file: Express.Multer.File) {
    let data = null;
    try {
      data = JSON.parse(file.buffer.toString());
    } catch (e) {
      new HttpException('Invalid file', 400);
    }

    const aulas = await this.normalizarDados(data);

    await this.saveModules(aulas);
    await this.saveClasses(aulas);
    await this.saveClassesParts(aulas);
    await this.saveVideos(aulas);

    return {
      status: true,
      message: 'Data successfully imported',
    };
  }

  async importVideo(file: Express.Multer.File, id?: number) {
    id = Number(id ?? file.originalname.match(/(F?0*)([0-9]+)(\.....?)$/)?.[2]);

    await this.videoRepository.update(
      { id },
      {
        size: file.size,
        path: await this.s3.put(String(id), file.buffer),
      },
    );

    return this.videoRepository.findOneBy({ id });
  }

  private async normalizarDados(
    data: TelegramChannelData,
  ): Promise<PartNormalized[]> {
    const item = data.messages.filter(
      ({ media_type }) => media_type === 'video_file',
    );

    return item.map((video) => {
      const matcher = video.text_entities
        .reduce(
          (carry, item) =>
            item.type === 'plain' || item.type === 'link'
              ? carry + item.text
              : carry,
          '',
        )
        .split('\n')
        .map((line) => line.match(/^(\s|=)*(\d+)(\.\s)(.*$)/))
        .filter((t) => t) as RegExpMatchArray[];

      return {
        id: Number(video.text_entities[0].text.slice(2)),
        modulo: matcher[1][4],
        moduloIndex: Number(matcher[1][2]),
        aula: matcher[2][4],
        aulaIndex: Number(matcher[2][2]),
        parte: matcher[0][4],
        parteIndex: Number(matcher[0][2]),
        video: {
          id: Number(video.text_entities[0].text.slice(2)),
          path: video.file,
          duration: Number(video.duration_seconds),
          size: fs.existsSync(video.file)
            ? Math.floor((fs.statSync(video.file).size / 1024 / 1024) * 100) /
              100
            : 0,
          mimeType: video.mime_type,
          thumbnailPath: video.thumbnail,
        },
      };
    });
  }

  private async saveModules(aulas: PartNormalized[]) {
    await this.moduleRepository.save(
      aulas
        .map(({ moduloIndex, modulo }) => ({ id: moduloIndex, name: modulo }))
        .filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i),
    );
  }

  private classesIds: Record<string, number> = {};

  private async saveClasses(aulas: PartNormalized[]) {
    const classes = await this.classRepository.save(
      aulas
        .map(({ moduloIndex, aula, aulaIndex }) => ({
          module: { id: moduloIndex },
          index: aulaIndex,
          name: aula,
        }))
        .filter(
          (v, i, a) =>
            a.findIndex(
              (t) => t.module.id === v.module.id && t.index === v.index,
            ) === i,
        ),
    );
    classes.forEach(({ id, module, index }) => {
      this.classesIds[`${module.id}-${index}`] = id;
    });
  }

  private async saveVideos(aulas: PartNormalized[]) {
    return this.videoRepository.save(aulas.map(({ video }) => video));
  }

  private async saveClassesParts(aulas: PartNormalized[]) {
    return this.sectionRepository.save(
      aulas.map(({ id, parte, moduloIndex, aulaIndex, parteIndex }) => ({
        id,
        name: parte,
        class: { id: this.classesIds[`${moduloIndex}-${aulaIndex}`] },
        index: parteIndex,
      })),
    );
  }
}
