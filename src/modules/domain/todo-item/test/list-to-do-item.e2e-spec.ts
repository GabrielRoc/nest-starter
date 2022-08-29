import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthModule } from 'src/modules/infrastructure/auth/auth.module';
import { DatabaseTestModule } from 'src/modules/infrastructure/database/database-test.module';
import * as request from 'supertest';
import { TodoItemModule } from '../todo-item.module';

let app: INestApplication;
let appRequest: request.SuperTest<request.Test>;
let token1: string;

beforeAll(async () => {
  const module = await Test.createTestingModule({
    imports: [DatabaseTestModule, AuthModule, TodoItemModule],
  }).compile();
  app = module.createNestApplication();
  await app.init();

  appRequest = request(app.getHttpServer());

  await appRequest.post('/auth/register').send({
    email: 'test1@test.com',
    password: '12345678',
  });

  const login1 = await appRequest
    .post('/auth/login')
    .send({
      email: 'test1@test.com',
      password: '12345678',
    })
    .expect(200);

  token1 = login1.text;

  await appRequest.post('/auth/register').send({
    email: 'test2@test.com',
    password: '12345678',
  });
});

afterAll(async () => {
  await app.close();
});

describe('List To-Do Item', () => {
  it('/list (GET) - Fail (user not logged in)', async () => {
    return await appRequest.get('/todo-item/list').expect(403);
  });

  it('/list (GET) - Sucess', async () => {
    return await appRequest
      .get('/todo-item/list')
      .set('Authorization', `Bearer ${token1}`)
      .expect((res) => {
        expect(res.body.data).toStrictEqual([]);
      })
      .expect(200);
  });

  it('/list (GET) - Sucess (with pagination params)', async () => {
    for (let i = 0; i < 13; i++) {
      await appRequest
        .post('/todo-item/create')
        .send({
          title: 'test',
          description: 'test',
        })
        .set('Authorization', `Bearer ${token1}`)
        .expect(201);
    }

    return await appRequest
      .get('/todo-item/list')
      .query({
        page: 3,
        limit: 5,
      })
      .set('Authorization', `Bearer ${token1}`)
      .expect((res) => {
        expect(res.body.data.length).toBe(3);
      })
      .expect(200);
  });
  2;

  it('/list (GET) - Fail (invalid pagination params)', async () => {
    return await appRequest
      .get('/todo-item/list')
      .query({
        page: 0,
        limit: 1,
      })
      .set('Authorization', `Bearer ${token1}`)
      .expect(400);
  });
});
