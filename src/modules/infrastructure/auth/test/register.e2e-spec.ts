import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { DatabaseTestModule } from '../../database/database-test.module';
import { AuthModule } from '../auth.module';

let app: INestApplication;
let appRequest: request.SuperTest<request.Test>;

beforeAll(async () => {
  const module = await Test.createTestingModule({
    imports: [DatabaseTestModule, AuthModule],
  }).compile();
  app = module.createNestApplication();
  await app.init();

  appRequest = request(app.getHttpServer());
});

afterAll(async () => {
  await app.close();
});

describe('Register (e2e)', () => {
  it('/register (POST) - Fail (required field missing)', async () => {
    return await appRequest
      .post('/auth/register')
      .send({
        password: '12345678',
      })
      .expect(400);
  });

  it('/register (POST) - Fail (password less than 8 characters)', async () => {
    return await appRequest
      .post('/auth/register')
      .send({
        email: 'test@test.com',
        password: '1234',
      })
      .expect(400);
  });

  it('/register (POST) - Sucess', async () => {
    return await appRequest
      .post('/auth/register')
      .send({
        email: 'test@test.com',
        password: '12345678',
      })
      .expect(201);
  });

  it('/register (POST) - Fail (user already exists)', async () => {
    return await appRequest
      .post('/auth/register')
      .send({
        email: 'test@test.com',
        password: '12345678',
      })
      .expect(409);
  });
});
