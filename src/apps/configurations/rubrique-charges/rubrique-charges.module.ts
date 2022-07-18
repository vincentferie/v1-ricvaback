import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RubriqueChargesController } from './rubrique-charges.controller';
import { RubriquesChargesEntity } from './rubrique-charges.entity';
import { RubriqueChargesService } from './rubrique-charges.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RubriquesChargesEntity])
  ],
  controllers: [RubriqueChargesController],
  providers: [RubriqueChargesService]
})
export class RubriqueChargesModule {}
