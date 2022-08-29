import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthModule } from 'src/modules/infrastructure/auth/auth.module';
import { DatabaseTestModule } from 'src/modules/infrastructure/database/database-test.module';
import * as request from 'supertest';
import { TodoItemModule } from '../todo-item.module';

let app: INestApplication;
let appRequest: request.SuperTest<request.Test>;
let token1: string;
let token2: string;
let toDoItem: string;

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

  const login2 = await appRequest
    .post('/auth/login')
    .send({
      email: 'test2@test.com',
      password: '12345678',
    })
    .expect(200);

  token2 = login2.text;

  const createToDoItem = await appRequest
    .post('/todo-item/create')
    .send({
      title: 'test',
      description: 'test',
    })
    .set('Authorization', `Bearer ${token1}`)
    .expect(201);

  toDoItem = createToDoItem.body.id;
});

afterAll(async () => {
  await app.close();
});

describe('Delete To-Do Item', () => {
  it('/delete (PATH) - Fail (user not logged in)', async () => {
    return await appRequest.delete(`/todo-item/delete/${toDoItem}`).expect(403);
  });

  it('/delete (PATH) - Fail (to-do item does not belong to the user)', async () => {
    return await appRequest
      .delete(`/todo-item/delete/${toDoItem}`)
      .set('Authorization', `Bearer ${token2}`)
      .expect(403);
  });

  it('/delete (PATH) - Sucess', async () => {
    return await appRequest
      .delete(`/todo-item/delete/${toDoItem}`)
      .set('Authorization', `Bearer ${token1}`)
      .expect(200);
  });
});
