import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JoiPipe } from 'nestjs-joi';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationResponseDto } from 'src/common/dtos/pagination.dto';
import { PaginationParams } from 'src/common/interfaces/pagination.interface';
import { JwtAuthGuard } from 'src/modules/infrastructure/auth/auth.guard';
import { User } from '../../infrastructure/user/entities/user.entity';
import { CreateTodoItemDto } from './dto/create-todo-item.dto';
import { UpdateTodoItemDto } from './dto/update-todo-item.dto';
import { TodoItem } from './entities/todo-item.entity';
import { TodoItemService } from './todo-item.service';

@Controller('todo-item')
@UseGuards(JwtAuthGuard)
export class TodoItemController {
  constructor(private readonly todoItemService: TodoItemService) {}

  @Post('create')
  async create(
    @AuthUser() user: User,
    @Body(new JoiPipe({ group: 'CREATE' }))
    createTodoItemDto: CreateTodoItemDto,
  ): Promise<TodoItem> {
    if (!user) throw new ForbiddenException('User not logged in');

    return await this.todoItemService.create(createTodoItemDto, user);
  }

  @Get('list')
  async findAll(
    @AuthUser() user: User,
    @Pagination() paginationParams: PaginationParams,
  ): Promise<PaginationResponseDto<TodoItem>> {
    return new PaginationResponseDto<TodoItem>(
      await this.todoItemService.findAll(paginationParams, user),
    );
  }

  @Get('get/:id')
  async findOne(
    @AuthUser() user: User,
    @Param('id') id: string,
  ): Promise<TodoItem> {
    return await this.todoItemService.findOne(id, user);
  }

  @Patch('update/:id')
  async update(
    @AuthUser() user: User,
    @Param('id') id: string,
    @Body(new JoiPipe({ group: 'UPDATE' }))
    updateTodoItemDto: UpdateTodoItemDto,
  ): Promise<TodoItem> {
    return await this.todoItemService.update(id, updateTodoItemDto, user);
  }

  @Delete('delete/:id')
  async remove(
    @AuthUser() user: User,
    @Param('id') id: string,
  ): Promise<TodoItem> {
    return await this.todoItemService.remove(id, user);
  }
}
