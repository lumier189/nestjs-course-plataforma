import {
  Controller,
  Get,
  HttpException,
  Param,
  ParseArrayPipe,
  Query,
  Request,
} from '@nestjs/common';
import { ModuleService } from './module.service';

@Controller('module')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Get()
  findAll(
    @Request() { user },
    @Query('filters') filters = {},
    @Query('relations', new ParseArrayPipe({ optional: true, separator: ',' }))
    relations: string[] = [],
  ) {
    return this.moduleService.findAll(filters, relations, user?.sub);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('relations', new ParseArrayPipe({ optional: true, separator: ',' }))
    relations: string[] = [],
    @Request() { user },
  ) {
    return this.moduleService.findOne(+id, relations, user?.sub).catch(() => {
      throw new HttpException('Module not found', 404);
    });
  }
}
