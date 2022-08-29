import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';
import { User } from 'src/modules/infrastructure/user/entities/user.entity';

export class UpdateTodoItemDto {
  @JoiSchema(['UPDATE'], Joi.string().optional())
  title: string;

  @JoiSchema(['UPDATE'], Joi.string().optional())
  description: string;

  @JoiSchema(['UPDATE'], Joi.boolean().optional())
  status: boolean;

  @JoiSchema(['UPDATE'], Joi.forbidden())
  createdBy: User;
}
