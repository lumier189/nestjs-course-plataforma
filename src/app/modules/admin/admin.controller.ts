import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async import(@UploadedFile() file: Express.Multer.File) {
    return await this.adminService.import(file);
  }

  @Post('import/video')
  @UseInterceptors(FileInterceptor('file'))
  async importVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body('id') id?: number,
  ) {
    return await this.adminService.importVideo(file, id);
  }
}
