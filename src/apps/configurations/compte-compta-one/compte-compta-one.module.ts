import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompteComptaOneController } from './compte-compta-one.controller';
import { CompteComptableOneEntity } from './compte-compta-one.entity';
import { CompteComptaOneService } from './compte-compta-one.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([CompteComptableOneEntity]),
  ],
  controllers: [CompteComptaOneController],
  providers: [CompteComptaOneService],
  exports: [CompteComptaOneService],
})
export class CompteComptaOneModule {}
