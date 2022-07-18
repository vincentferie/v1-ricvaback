import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompteBankGeneraleController } from './compte-bank-generale.controller';
import { CompteBankGroupementEntity } from './compte-bank-generale.entity';
import { CompteBankGeneraleService } from './compte-bank-generale.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([CompteBankGroupementEntity])
  ],
  controllers: [CompteBankGeneraleController],
  providers: [CompteBankGeneraleService]
})
export class CompteBankGeneraleModule {}
