import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '@infra/database/entities/profile/profile.entity';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly repository: Repository<Profile>,
  ) {}

  async create(createProfileDto: CreateProfileDto) {
    const userAlreadyExists = await this.repository.findOneBy({
      email: createProfileDto.email,
    });
    if (userAlreadyExists) {
      throw new HttpException('Email already exists', 400);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordConfirmation, ...profile } = createProfileDto;
    return this.repository.save(profile);
  }

  findOne(id: number) {
    return this.repository.findOneOrFail({
      relations: ['videoProgresses'],
      where: { id },
    });
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    await this.repository.findOneByOrFail({ id });
    return this.repository.save({ id, ...updateProfileDto });
  }

  async remove(id: number) {
    await this.repository.findOneByOrFail({ id });
    await this.repository.delete({ id });
  }
}
