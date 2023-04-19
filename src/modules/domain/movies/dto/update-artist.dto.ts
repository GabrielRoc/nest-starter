import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';

export class UpdateArtistDto {
  @JoiSchema(['CREATE'], Joi.string().optional())
  name: string;

  @JoiSchema(['CREATE'], Joi.string().optional())
  description: string;

  @JoiSchema(['CREATE'], Joi.string().uri().optional())
  image: string;
}
