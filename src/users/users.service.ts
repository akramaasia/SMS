import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './users.repository';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);
@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  create(email: string, password: string) {
    try {
      return this.userRepository.createUser(email, password);
    } catch (error) {
      throw error;
    }
  }

  async signUp(email: string, password: string) {
    const users = await this.userRepository.findUserEmail(email);
    if (users.length) {
      throw new ConflictException('email in use');
    }
    //hash the user password, generate salt

    const salt = randomBytes(8).toString('hex');
    // hash the salt and password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    //create a new user and save it
    const user = this.userRepository.createUser(email, result);
    //return the user
    return user;
  }

  async singIn(email: string, password: string) {
    const [user] = await this.findUserEmail(email);
    if (!user) {
      throw new UnauthorizedException('user not found');
    }
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new UnauthorizedException('Bad Password');
    } else return user;
  }

  findAll() {
    try {
      return this.userRepository.getAllUsers();
    } catch (error) {
      throw error;
    }
  }

  findUserEmail(email: string) {
    try {
      // console.log(email);
      return this.userRepository.findUserEmail(email);
    } catch (error) {
      throw new NotFoundException('user not found ');
    }
  }

  findOne(id: number) {
    try {
      return this.userRepository.findUserById(id);
    } catch (error) {
      throw error;
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    try {
      return this.userRepository.updateUser(id, updateUserDto);
    } catch (error) {
      throw error;
    }
  }

  updatePut(id: number, updateStudentDto: UpdateUserDto) {
    try {
      return this.userRepository.updateUserPut(id, updateStudentDto);
    } catch (error) {
      throw error;
    }
  }

  remove(id: number) {
    try {
      return this.userRepository.removeUser(id);
    } catch (error) {
      throw error;
    }
  }
}
