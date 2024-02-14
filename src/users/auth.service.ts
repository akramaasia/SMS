import { BadRequestException, Injectable } from '@nestjs/common';
import { randomBytes,scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { UsersService } from './users.service';
import { UserRepository } from './users.repository';
const scrypt= promisify(_scrypt);
Injectable()
export class AuthService{
    constructor(private readonly userRepository: UserRepository) {}

async signUp( email : string,  password: string)
{
    //see if email is in use
    //console.log (this.userService)
    const users=await this.userRepository.findUserEmail(email);
    if (users.length)
    {
        throw new BadRequestException('email in use');
    }
//hash the user password, generate salt

const salt= randomBytes(8).toString('hex');
// hash the salt and password together
const hash=(await scrypt(password, salt, 32)) as Buffer;
const result= salt + '.' + hash.toString('hex');

//create a new user and save it
const user = this.userRepository.createUser(email, result);
//return the user
return user;
}
signIn()
{}
}
