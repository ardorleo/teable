import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { ClsService } from 'nestjs-cls';
import { FieldCreatingService } from './field-creating.service';
import { FieldOpenApiModule } from './field-open-api.module';

describe('FieldCreatingService', () => {
  let service: FieldCreatingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [FieldOpenApiModule],
    })
      .useMocker((token) => {
        if (token === ClsService) {
          return jest.fn();
        }
      })
      .compile();

    service = module.get<FieldCreatingService>(FieldCreatingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
