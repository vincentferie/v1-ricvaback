import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompteComptaFourController } from './compte-compta-four.controller';
import { CompteComptableFourEntity } from './compte-compta-four.entity';
import { CompteComptaFourService } from './compte-compta-four.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompteComptableFourEntity]),
  ],
  controllers: [CompteComptaFourController],
  providers: [CompteComptaFourService],
  exports: [CompteComptaFourService],

})
export class CompteComptaFourModule {}
