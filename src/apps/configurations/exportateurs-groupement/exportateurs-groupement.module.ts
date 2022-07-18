import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExportateursGroupementController } from './exportateurs-groupement.controller';
import { ExportateursGroupementEntity } from './exportateurs-groupement.entity';
import { ExportateursGroupementService } from './exportateurs-groupement.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExportateursGroupementEntity])
  ],
  controllers: [ExportateursGroupementController],
  providers: [ExportateursGroupementService]
})
export class ExportateursGroupementModule {}
