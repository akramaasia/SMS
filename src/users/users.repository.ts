import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DbError } from 'src/shared.config/dberror.error';
import { UsersEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserRepository extends Repository<UsersEntity> {
  constructor(private dataSource: DataSource) {
    super(UsersEntity, dataSource.createEntityManager());
  }

  async getAllUsers() {
    return this.find().catch((error) => {
      throw new DbError(error);
    });
  }
  async findUserEmail(email: string) {
    return this.find({ where: { email } }).catch((error) => {
      throw new DbError(error);
    });
  }

  async findUserById(id: number) {
    if (!id) {
      return null;
    }
    return this.findOne({
      where: {
        id,
      },
    }).catch((error) => {
      throw new DbError(error);
    });
  }
  async createUser(email: string, password: string) {
    return this.save({ email, password }).catch((error) => {
      throw new DbError(error);
    });
  }

  async removeUser(id: number) {
    const userById = await this.findUserById(id);
    if (!userById) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.delete(id).catch((error) => {
      throw new DbError(error);
    });
  }

  async updateUserPut(id: number, updateUserDto: UpdateUserDto) {
    const userById = await this.findUserById(id);
    if (!userById) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.update(id, updateUserDto).catch((error) => {
      throw new DbError(error);
    });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const updateStudent = { ...user, ...updateUserDto };
    return this.save(updateStudent).catch((error) => {
      throw new DbError(error);
    });
  }
}
