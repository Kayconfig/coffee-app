import { Test, TestingModule } from '@nestjs/testing';
import {
  HttpServer,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { CoffeesModule } from '../../src/coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateCoffeeDto } from 'src/coffees/dto/create-coffee.dto';
import { UpdateCoffeeDto } from 'src/coffees/dto/update-coffee.dto';

describe('[Feature] Coffees - /coffees', () => {
  const coffee = {
    name: 'Shipwreck Roast',
    brand: 'Buddy Brew',
    flavors: ['chocolate', 'vanilla'],
  };
  const expectedPartialCoffee = expect.objectContaining({
    ...coffee,
    flavors: expect.arrayContaining(
      coffee.flavors.map((name) => expect.objectContaining({ name })),
    ),
  });
  const coffeesUrl = '/api/v1/coffees';
  let app: INestApplication;
  let httpServer: HttpServer;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeesModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          username: 'postgres',
          password: 'pass123',
          host: 'localhost',
          port: 5433,
          database: 'postgres',
          synchronize: true,
          autoLoadEntities: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    app.setGlobalPrefix('/api/v1');

    await app.init();
    httpServer = app.getHttpServer();
  });

  it('Create [POST /]', async () => {
    return request(httpServer)
      .post(coffeesUrl)
      .send(coffee as CreateCoffeeDto)
      .expect(HttpStatus.CREATED)
      .expect(({ body: { data } }) => {
        expect(data).toEqual(expectedPartialCoffee);
      });
  });
  it('Get all [GET /]', async () => {
    return request(httpServer)
      .get(coffeesUrl)
      .expect(({ body: { data } }) => {
        expect(data).toBeInstanceOf(Array);
        expect(data.length).toBeGreaterThan(0);
        expect(data[0]).toEqual(expectedPartialCoffee);
      });
  });
  it('Get one [GET /:id]', async () => {
    return request(httpServer)
      .get(`${coffeesUrl}/1`)
      .expect(({ body: { data } }) => {
        expect(data).toEqual(expectedPartialCoffee);
      });
  });
  it('Update one [PATCH /:id]', async () => {
    const updateCoffee: UpdateCoffeeDto = {
      ...coffee,
      name: 'Updated coffe name',
    };
    return request(httpServer)
      .patch(`${coffeesUrl}/1`)
      .send(updateCoffee)
      .expect(({ body: { data } }) => {
        expect(data.name).toBe(updateCoffee.name);
        return request(httpServer)
          .get(`${coffeesUrl}/1`)
          .expect(({ body: { data } }) => {
            expect(data.name).toBe(updateCoffee.name);
          });
      });
  });
  it('Delete one [DELETE /:id]', async () => {
    return request(httpServer)
      .delete(`${coffeesUrl}/1`)
      .expect(HttpStatus.NO_CONTENT);
  });

  afterAll(async () => {
    await app.close();
  });
});
