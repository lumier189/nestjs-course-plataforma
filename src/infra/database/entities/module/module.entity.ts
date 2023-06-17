import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Expose, Transform } from 'class-transformer';
import {Class} from '../class/class.entity'
import {Progress} from '../profile/progress.entity'

@Entity({ name: 'modules' })
export class Module {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  imgSrc: string;

  @OneToMany(() => Class, (classe: Class) => classe.module)
  classes: Class[];

  @Expose({ name: 'progress' })
  @Transform(({ value, obj }: { value: Progress[], obj: Module }) => {
    if (value && value.length > 0) return value[0];
    const progress = new Progress();
    progress.entityId = obj.id;
    progress.entityType = 'module';
    progress.progress = 0;
    return progress;
  })
  progresses?: Progress[];
}
