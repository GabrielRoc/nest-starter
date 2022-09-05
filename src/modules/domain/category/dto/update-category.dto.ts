import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';

export class UpdateCategoryDto {
  @JoiSchema(['UPDATE'], Joi.string().required())
  name: string;
}
