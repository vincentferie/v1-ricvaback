import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BanquesController } from './banques.controller';
import { BanquesEntity } from './banques.entity';
import { BanquesService } from './banques.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BanquesEntity])
  ],
  controllers: [BanquesController],
  providers: [BanquesService]
})
export class BanquesModule {}
