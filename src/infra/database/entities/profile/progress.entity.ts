import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { Profile } from './profile.entity';

@Entity()
export class Progress {
  @PrimaryColumn()
  @Exclude()
  profileId: number;

  @PrimaryColumn()
  entityId: number;

  @PrimaryColumn()
  @Exclude()
  entityType: string;

  @Column({ type: 'float' })
  progress: number;

  @ManyToOne(() => Profile)
  profile: Profile;

  @Expose({ name: 'isFinished' })
  isFinished() {
    return this.progress >= 1;
  }
}
