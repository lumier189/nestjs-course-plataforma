import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Section } from '@infra/database/entities/section/section.entity';

@Entity()
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  duration: number;

  @Column()
  mimeType: string;

  @Column()
  size: number;

  @Column()
  path: string;

  @Column({ nullable: true })
  thumbnailPath?: string;

  @Column({ type: 'text', nullable: true })
  summary?: string;

  @OneToOne(() => Section, (section) => section.video)
  @JoinColumn({ name: 'id' })
  section: Section;
}
