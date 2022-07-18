import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlombEntity } from './plomb.entity';
import { PlombsController } from './plomb.controller';
import { PlombsService } from './plomb.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlombEntity])
  ],
  controllers: [PlombsController],
  providers: [PlombsService]
})
export class PlombsModule {}
