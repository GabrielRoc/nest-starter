import * as Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class UserDto {
  @JoiSchema(['REGISTER', 'LOGIN'], Joi.string().email().required())
  email: string;

  @JoiSchema(['REGISTER', 'LOGIN'], Joi.string().min(8).required())
  password: string;
}
