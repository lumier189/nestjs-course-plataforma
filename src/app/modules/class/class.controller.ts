import {
  Request,
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  Query,
  HttpException,
} from '@nestjs/common';
import { ClassService } from './class.service';

@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Get()
  findAll(
    @Query('filters') filters: Record<string, string> = {},
    @Query('relations', new ParseArrayPipe({ optional: true, separator: ',' }))
    relations: string[] = [],
    @Request() { user },
  ) {
    return this.classService.findAll(filters, relations, user?.sub);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('relations', new ParseArrayPipe({ optional: true, separator: ',' }))
    relations: string[] = [],
    @Request() { user },
  ) {
    return this.classService.findOne(+id, relations, user?.sub).catch(() => {
      throw new HttpException('Class not found', 404);
    });
  }
}
