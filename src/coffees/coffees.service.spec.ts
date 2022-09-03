import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const mockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
});

describe('CoffeesService', () => {
  let service: CoffeesService;
  let coffeeRepo: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoffeesService,
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: getRepositoryToken(Coffee),
          useValue: mockRepository<Coffee>(),
        },
        {
          provide: getRepositoryToken(Flavor),
          useValue: mockRepository<Flavor>(),
        },
      ],
    }).compile();

    service = module.get<CoffeesService>(CoffeesService);
    coffeeRepo = module.get<MockRepository>(getRepositoryToken(Coffee));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('when coffee ID exists', () => {
      it('should return coffee object', async () => {
        const coffeeId = 1;
        const expectedCoffee = { name: 'Despacito Coffee' };
        coffeeRepo.findOne.mockReturnValue(expectedCoffee);
        const coffee = await service.findOne(coffeeId);
        expect(coffee).toEqual(expectedCoffee);
        expect(coffee.name).toEqual(expectedCoffee.name);
      });
    });

    describe('otherwise', () => {
      it('should throw NotFoundException', async () => {
        const coffeeId = 1;
        coffeeRepo.findOne.mockReturnValue(undefined);
        try {
          await service.findOne(coffeeId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toBe(`Coffee #${coffeeId} not found!`);
        }
      });
    });
  });
});
