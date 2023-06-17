import { IsOptional } from 'class-validator';

export class SectionUpdateDto {
  @IsOptional()
  videoProgress?: {
    progress?: number;
    status?: 'completed' | 'not-started';
  };
}
