import {
  Controller,
  Response,
  Get,
  Param,
  Query,
  Request,
  HttpException,
  ParseArrayPipe,
} from '@nestjs/common';
import { SectionService } from './section.service';
@Controller('section')
export class SectionController {
  constructor(private readonly classPartService: SectionService) {}

  @Get()
  findAll(
    @Query('filters') filters: Record<string, string> = {},
    @Query('relations', new ParseArrayPipe({ optional: true, separator: ',' }))
    relations: string[] = [],
    @Request() { user },
  ) {
    return this.classPartService.findAll(filters, relations, user?.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() { user }) {
    return this.classPartService.findOne(+id, user?.sub).catch(() => {
      throw new HttpException('Section not found', 404);
    });
  }

  @Get(':id/video')
  async getVideo(@Param('id') id: string) {
    return this.classPartService.getVideo(+id);
  }
}
