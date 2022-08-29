import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';
import { User } from 'src/modules/infrastructure/user/entities/user.entity';

export class CreateTodoItemDto {
  @JoiSchema(['CREATE'], Joi.string().required())
  title: string;

  @JoiSchema(['CREATE'], Joi.string().required())
  description: string;

  @JoiSchema(['CREATE'], Joi.forbidden())
  createdBy: User;
}
