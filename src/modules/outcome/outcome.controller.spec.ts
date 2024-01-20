import { Test, TestingModule } from '@nestjs/testing';
import { OutcomeController } from './outcome.controller';

describe('OutcomeController', () => {
  let controller: OutcomeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OutcomeController],
    }).compile();

    controller = module.get<OutcomeController>(OutcomeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
