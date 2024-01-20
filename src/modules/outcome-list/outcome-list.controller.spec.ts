import { Test, TestingModule } from '@nestjs/testing';
import { OutcomeListController } from './outcome-list.controller';

describe('OutcomeListController', () => {
  let controller: OutcomeListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OutcomeListController],
    }).compile();

    controller = module.get<OutcomeListController>(OutcomeListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
