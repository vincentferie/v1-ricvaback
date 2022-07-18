import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompteBankExportateurController } from './compte-bank-exportateur.controller';
import { CompteBankExportateurEntity } from './compte-bank-exportateur.entity';
import { CompteBankExportateurService } from './compte-bank-exportateur.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CompteBankExportateurEntity,
    ])
  ],
  controllers: [CompteBankExportateurController],
  providers: [
    CompteBankExportateurService
  ]
})
export class CompteBankExportateurModule {}
