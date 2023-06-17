import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Request,
  UseGuards,
  HttpException,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthenticationGuard } from '../authentication/guard/authentication.guard';
import { ProgressService } from './services/progress.service';
import { ProfileService } from './services/profile.service';
import { EntityNotFoundError } from "typeorm";

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly progressService: ProgressService,
  ) {}

  @Post()
  create(@Body() createProfileDto: CreateProfileDto) {
    if (createProfileDto.password !== createProfileDto.passwordConfirmation) {
      throw new HttpException(
        'Password and password confirmation must be equal',
        400,
      );
    }

    return this.profileService.create(createProfileDto);
  }

  @Get('')
  @UseGuards(AuthenticationGuard)
  findOne(@Request() { user }) {
    return this.profileService.findOne(+user.sub);
  }

  @Patch('')
  @UseGuards(AuthenticationGuard)
  update(@Request() { user }, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(+user.sub, updateProfileDto);
  }

  @Delete('')
  @UseGuards(AuthenticationGuard)
  remove(@Request() { user }) {
    return this.profileService.remove(+user.sub);
  }

  @Get('progress/:entityType')
  @UseGuards(AuthenticationGuard)
  listProgress(@Request() { user }, @Param('entityType') entityType: string) {
    return this.progressService.findAll(user.sub, entityType);
  }

  @Get('progress/:entityType/:entityId')
  @UseGuards(AuthenticationGuard)
  getProgress(
    @Request() { user },
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: number,
  ) {
    if (!['class', 'section', 'module'].includes(entityType)) {
      throw new NotFoundException();
    }

    return this.progressService
      .findOne(user.sub, entityType, entityId)
      .catch((error) => {
        if (error instanceof EntityNotFoundError) {
          throw new NotFoundException();
        }
      });
  }

  @Patch('progress/:entityType/:entityId')
  @UseGuards(AuthenticationGuard)
  updateProgress(
    @Request() { user },
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: number,
    @Body() { progress }: { progress: number },
  ) {
    if (!['class', 'section', 'module'].includes(entityType)) {
      throw new NotFoundException();
    }

    return this.progressService.save(user.sub, progress, entityId);
  }
}
