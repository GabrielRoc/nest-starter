import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';

export class CreateArtistDto {
  @JoiSchema(['CREATE'], Joi.string().required())
  name: string;

  @JoiSchema(['CREATE'], Joi.string().required())
  description: string;

  @JoiSchema(['CREATE'], Joi.string().uri().required())
  image: string;
}
