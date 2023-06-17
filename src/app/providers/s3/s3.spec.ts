import { Test, TestingModule } from '@nestjs/testing';
import { S3 } from './s3';

describe('S3', () => {
  let provider: S3;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [S3],
    }).compile();

    provider = module.get<S3>(S3);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
