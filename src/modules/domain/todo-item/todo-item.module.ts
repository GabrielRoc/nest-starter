import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoItem } from './entities/todo-item.entity';
import { TodoItemController } from './todo-item.controller';
import { TodoItemService } from './todo-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([TodoItem])],
  controllers: [TodoItemController],
  providers: [TodoItemService],
  exports: [TypeOrmModule],
})
export class TodoItemModule {}
