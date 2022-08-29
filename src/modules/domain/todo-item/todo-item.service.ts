import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PaginationParams,
  PaginationResult,
} from 'src/common/interfaces/pagination.interface';
import { Repository } from 'typeorm';
import { User } from '../../infrastructure/user/entities/user.entity';
import { CreateTodoItemDto } from './dto/create-todo-item.dto';
import { UpdateTodoItemDto } from './dto/update-todo-item.dto';
import { TodoItem } from './entities/todo-item.entity';

@Injectable()
export class TodoItemService {
  @InjectRepository(TodoItem)
  private readonly todoItemsRepository: Repository<TodoItem>;

  async create(
    createTodoItemDto: CreateTodoItemDto,
    user: User,
  ): Promise<TodoItem> {
    const todoItem = this.todoItemsRepository.create({
      ...createTodoItemDto,
      createdBy: user,
    });

    return await this.todoItemsRepository.save(todoItem);
  }

  async findAll(
    paginationParams: PaginationParams,
    user: User,
  ): Promise<PaginationResult<TodoItem>> {
    const todoItems = await this.todoItemsRepository.find({
      where: { createdBy: { id: user.id } },
      skip: (paginationParams.page - 1) * paginationParams.limit,
      take: paginationParams.limit,
    });

    const countItems = await this.todoItemsRepository.count({
      where: { createdBy: { id: user.id } },
    });

    const meta = {
      itemsPerPage: +paginationParams.limit,
      totalItems: +countItems,
      currentPage: +paginationParams.page,
      totalPages: +Math.ceil(countItems / paginationParams.limit),
    };

    return {
      data: todoItems,
      meta: meta,
    };
  }

  async findOne(id: string, user: User): Promise<TodoItem> {
    const todoItem = await this.todoItemsRepository.findOne({
      where: { id: id },
      relations: ['createdBy'],
    });
    if (!todoItem) throw new NotFoundException();
    if (todoItem.createdBy.id !== user.id) throw new ForbiddenException();

    return todoItem;
  }

  async update(
    id: string,
    updateTodoItemDto: UpdateTodoItemDto,
    user: User,
  ): Promise<TodoItem> {
    let todoItem = await this.todoItemsRepository.findOne({
      where: { id: id },
      relations: ['createdBy'],
    });
    if (todoItem.createdBy.id !== user.id) throw new ForbiddenException();
    await this.todoItemsRepository.update(id, updateTodoItemDto);
    todoItem = await this.todoItemsRepository.findOneBy({ id: id });

    return todoItem;
  }

  async remove(id: string, user: User): Promise<TodoItem> {
    const todoItem = await this.todoItemsRepository.findOne({
      where: { id: id },
      relations: ['createdBy'],
    });
    if (todoItem.createdBy.id !== user.id) throw new ForbiddenException();
    await this.todoItemsRepository.softDelete(id);

    return todoItem;
  }
}
