import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { DatabaseTestModule } from '../../database/database-test.module';
import { UserModule } from '../../user/user.module';
import { AuthModule } from '../auth.module';

let app: INestApplication;
let appRequest: request.SuperTest<request.Test>;

beforeAll(async () => {
  const module = await Test.createTestingModule({
    imports: [UserModule, DatabaseTestModule, AuthModule],
  }).compile();
  app = module.createNestApplication();
  await app.init();

  appRequest = request(app.getHttpServer());

  await appRequest
    .post('/auth/register')
    .send({
      email: 'test@test.com',
      password: '12345678',
    })
    .expect(201);
});

afterAll(async () => {
  await app.close();
});

describe('Login (e2e)', () => {
  it('/login (POST) - Fail (required field missing)', async () => {
    return await appRequest
      .post('/auth/login')
      .send({
        password: '12345678',
      })
      .expect(400);
  });
  it('/login (POST) - Fail (wrong password)', async () => {
    return await appRequest
      .post('/auth/login')
      .send({
        email: 'test@test.com',
        password: 'abcdefgh',
      })
      .expect(401);
  });
  it('/login (POST) - Fail (non existent user)', async () => {
    return await appRequest
      .post('/auth/login')
      .send({
        email: 'nonexistent@test.com',
        password: 'abcdefgh',
      })
      .expect(404);
  });
  it('/login (POST) - Success', async () => {
    return await appRequest
      .post('/auth/login')
      .send({
        email: 'test@test.com',
        password: '12345678',
      })
      .expect(200);
  });
});
