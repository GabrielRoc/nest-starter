import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoItem } from 'src/modules/domain/todo-item/entities/todo-item.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      logging: false,
      entities: [User, TodoItem],
      synchronize: true,
    }),
  ],
})
export class DatabaseTestModule {}
