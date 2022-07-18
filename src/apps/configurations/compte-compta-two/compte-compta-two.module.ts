import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompteComptaTwoController } from './compte-compta-two.controller';
import { CompteComptableTwoEntity } from './compte-compta-two.entity';
import { CompteComptaTwoService } from './compte-compta-two.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompteComptableTwoEntity]),
  ],
  controllers: [CompteComptaTwoController],
  providers: [CompteComptaTwoService],
  exports: [CompteComptaTwoService],

})
export class CompteComptaTwoModule {}
