import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthModule } from 'src/modules/infrastructure/auth/auth.module';
import { DatabaseTestModule } from 'src/modules/infrastructure/database/database-test.module';
import * as request from 'supertest';
import { CategoryModule } from '../../category/category.module';
import { TodoItemModule } from '../todo-item.module';

let app: INestApplication;
let appRequest: request.SuperTest<request.Test>;
let token1: string;
let token2: string;
let categoryId: string;

beforeAll(async () => {
  const module = await Test.createTestingModule({
    imports: [DatabaseTestModule, AuthModule, TodoItemModule, CategoryModule],
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

  const login2 = await appRequest
    .post('/auth/login')
    .send({
      email: 'test2@test.com',
      password: '12345678',
    })
    .expect(200);

  token2 = login2.text;

  const postCategory1 = await appRequest
    .post('/category/create')
    .set('Authorization', `Bearer ${token1}`)
    .send({
      name: 'Category 1',
    })
    .expect(201);

  categoryId = postCategory1.body.id;
});

afterAll(async () => {
  await app.close();
});

describe('Create To-Do Items', () => {
  it('/create (POST) - Fail (user not logged in)', async () => {
    return await appRequest
      .post('/todo-item/create')
      .send({
        title: 'test',
        description: 'test',
        categoryId: categoryId,
      })
      .expect(403);
  });

  it('/create (POST) - Fail (required field missing)', async () => {
    return await appRequest
      .post('/todo-item/create')
      .send({
        title: 'test',
        categoryId: categoryId,
      })
      .set('Authorization', `Bearer ${token1}`)
      .expect(400);
  });

  it('/create (POST) - Fail (random string at categoryId)', async () => {
    await appRequest
      .post('/todo-item/create')
      .send({
        title: 'test',
        description: 'test',
        categoryId: 'categoryId',
      })
      .set('Authorization', `Bearer ${token1}`)
      .expect(400);
  });

  it('/create (POST) - Sucess', async () => {
    await appRequest
      .post('/todo-item/create')
      .send({
        title: 'test',
        description: 'test',
        categoryId: categoryId,
      })
      .set('Authorization', `Bearer ${token1}`)
      .expect(201);
  });
});
