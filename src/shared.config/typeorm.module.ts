import { Module } from '@nestjs/common';
import { TypeOrmConfigService } from 'src/datasource/typeorm.config.service';
//import { databaseco

@Module({
 providers: [TypeOrmConfigService],
 exports: [TypeOrmConfigService],
})
export class TypeOrmConfigModule {}
