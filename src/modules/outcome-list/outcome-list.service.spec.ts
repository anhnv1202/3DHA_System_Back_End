import { Test, TestingModule } from '@nestjs/testing';
import { OutcomeListService } from './outcome-list.service';

describe('OutcomeListService', () => {
  let service: OutcomeListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OutcomeListService],
    }).compile();

    service = module.get<OutcomeListService>(OutcomeListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
