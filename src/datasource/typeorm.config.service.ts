import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';


@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
 constructor(private configService: ConfigService) {}


 createTypeOrmOptions(): TypeOrmModuleOptions {
   return {
     type: 'postgres',
     host: this.configService.get('DATABASE_HOST'),
     port: parseInt(this.configService.get('DATABASE_PORT'), 10),
     username: this.configService.get('DATABASE_USER_NAME'),
     password: this.configService.get('DATABASE_PASSWORD'),
     database: this.configService.get('DATABASE_NAME'),
     synchronize: this.configService.get('SYNCHRONIZATION'),//make direct tables against entities
     entities: [__dirname + '/../**/**/*.entity{.ts,.js}'],
   };
 }
}

