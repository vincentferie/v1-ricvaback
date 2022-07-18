import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompteComptaThreeController } from './compte-compta-three.controller';
import { CompteComptableThreeEntity } from './compte-compta-three.entity';
import { CompteComptaThreeService } from './compte-compta-three.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompteComptableThreeEntity]),
  ],
  controllers: [CompteComptaThreeController],
  providers: [CompteComptaThreeService],
  exports: [CompteComptaThreeService],

})
export class CompteComptaThreeModule {}
