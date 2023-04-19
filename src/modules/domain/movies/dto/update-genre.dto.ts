import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';

export class UpdateGenreDto {
  @JoiSchema(['CREATE'], Joi.string().optional())
  name: string;

  @JoiSchema(['CREATE'], Joi.string().optional())
  description: string;
}
