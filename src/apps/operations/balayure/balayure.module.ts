import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BalayureController } from './balayure.controller';
import { BalayureEntity } from './balayure.entity';
import { BalayureService } from './balayure.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BalayureEntity])
  ],
  controllers: [BalayureController],
  providers: [BalayureService]
})
export class BalayureModule {}
