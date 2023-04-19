import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';

export class CreateGenreDto {
  @JoiSchema(['CREATE'], Joi.string().required())
  name: string;

  @JoiSchema(['CREATE'], Joi.string().required())
  description: string;
}
