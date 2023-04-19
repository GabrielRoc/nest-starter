import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';

export class UpdateMovieDto {
  @JoiSchema(['CREATE'], Joi.string().optional())
  title: string;

  @JoiSchema(['CREATE'], Joi.string().optional())
  description: string;

  @JoiSchema(['CREATE'], Joi.number().optional())
  duration: number;

  @JoiSchema(['CREATE'], Joi.number().optional())
  year: number;

  @JoiSchema(['CREATE'], Joi.string().optional())
  image: string;

  @JoiSchema(['CREATE'], Joi.string().optional())
  directorId: string;

  @JoiSchema(['CREATE'], Joi.array().items(Joi.string()).optional())
  castIds: string[];

  @JoiSchema(['CREATE'], Joi.array().items(Joi.string()).optional())
  genresIds: string[];
}
