import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { UserDto } from './dto/user.dto';

@Injectable()
export class AuthService {
  @InjectRepository(User)
  private usersRepository: Repository<User>;
  private readonly jwtService: JwtService;

  constructor(jwtService: JwtService) {
    this.jwtService = jwtService;
  }

  async register(userDto: UserDto): Promise<User | never> {
    const { email } = userDto;
    let user = await this.usersRepository.findOne({ where: { email } });

    if (user)
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    else user = await this.usersRepository.create(userDto);

    await this.usersRepository.save(user);
    user.password = undefined;

    return user;
  }

  async login(userDto: UserDto): Promise<string | never> {
    const { email, password } = userDto;
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) throw new HttpException('No user found', HttpStatus.NOT_FOUND);

    const isPasswordValid: boolean = this.isPasswordValid(
      password,
      user.password,
    );

    if (!isPasswordValid)
      throw new HttpException('Incorret password', HttpStatus.UNAUTHORIZED);

    return this.generateToken(user);
  }

  async decode(token: string): Promise<unknown> {
    return this.jwtService.decode(token, null);
  }

  async validateUser(decoded: any): Promise<User> {
    return this.usersRepository.findOneBy({ id: decoded.id });
  }

  generateToken(user: User): string {
    return this.jwtService.sign({ id: user.id, email: user.email });
  }

  isPasswordValid(password: string, userPassword: string): boolean {
    return bcrypt.compareSync(password, userPassword);
  }

  async validate(token: string): Promise<User | never> {
    const decoded = this.jwtService.verify(token);

    if (!decoded) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const user = await this.validateUser(decoded);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
