import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BanquesSpecController } from './banques-spec.controller';
import { BanquesSpecEntity } from './banques-spec.entity';
import { BanquesSpecService } from './banques-spec.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BanquesSpecEntity])
  ],
  controllers: [BanquesSpecController],
  providers: [BanquesSpecService]
})
export class BanquesSpecModule {}
