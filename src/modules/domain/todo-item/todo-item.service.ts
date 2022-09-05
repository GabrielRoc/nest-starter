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
import { Category } from '../category/entities/category.entity';
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
      category: { id: createTodoItemDto.categoryId },
      createdBy: user,
    });

    return await this.todoItemsRepository.save(todoItem);
  }

  async findAll(
    paginationParams: PaginationParams,
    user: User,
  ): Promise<PaginationResult<TodoItem>> {
    const todoItems = await this.todoItemsRepository.findAndCount({
      where: { createdBy: { id: user.id } },
      skip: (paginationParams.page - 1) * paginationParams.limit,
      take: paginationParams.limit,
      relations: ['category'],
    });

    const meta = {
      itemsPerPage: +paginationParams.limit,
      totalItems: +todoItems[1],
      currentPage: +paginationParams.page,
      totalPages: +Math.ceil(todoItems[1] / paginationParams.limit),
    };

    return {
      data: todoItems[0],
      meta: meta,
    };
  }

  async findOne(id: string, user: User): Promise<TodoItem> {
    const todoItem = await this.todoItemsRepository.findOne({
      where: { id: id },
      relations: ['createdBy', 'category'],
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
    if (updateTodoItemDto.categoryId)
      todoItem.category = { id: updateTodoItemDto.categoryId } as Category;
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
