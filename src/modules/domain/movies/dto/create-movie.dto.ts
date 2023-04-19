import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';

export class CreateMovieDto {
  @JoiSchema(['CREATE'], Joi.string().required())
  title: string;

  @JoiSchema(['CREATE'], Joi.string().required())
  description: string;

  @JoiSchema(['CREATE'], Joi.number().required())
  duration: number;

  @JoiSchema(['CREATE'], Joi.number().required())
  year: number;

  @JoiSchema(['CREATE'], Joi.string().required())
  image: string;

  @JoiSchema(['CREATE'], Joi.string().required())
  directorId: string;

  @JoiSchema(['CREATE'], Joi.array().items(Joi.string()).required())
  castIds: string[];

  @JoiSchema(['CREATE'], Joi.array().items(Joi.string()).required())
  genresIds: string[];
}
