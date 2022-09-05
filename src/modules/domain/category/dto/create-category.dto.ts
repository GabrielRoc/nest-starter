import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';

export class CreateCategoryDto {
  @JoiSchema(['CREATE'], Joi.string().required())
  name: string;
}
