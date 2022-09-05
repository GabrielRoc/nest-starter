import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/modules/domain/category/entities/category.entity';
import { TodoItem } from 'src/modules/domain/todo-item/entities/todo-item.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      logging: false,
      entities: [User, TodoItem, Category],
      synchronize: true,
    }),
  ],
})
export class DatabaseTestModule {}
