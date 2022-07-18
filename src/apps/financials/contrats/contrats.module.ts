import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContratsController } from './contrats.controller';
import { ContratsEntity } from './contrats.entity';
import { ContratsService } from './contrats.service';
import { FileContratEntity } from './files-contrats/file-contrat.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      ContratsEntity,
      FileContratEntity
    ]),
    MulterModule.register({
      dest: './uploads',
    })
  ],
  controllers: [ContratsController],
  providers: [ContratsService]
})
export class ContratsModule {}
