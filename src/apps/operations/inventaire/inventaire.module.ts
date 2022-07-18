import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZonageEntity } from 'src/apps/configurations/zonage/zonage.entity';
import { InventaireController } from './inventaire.controller';
import { InventaireService } from './inventaire.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ZonageEntity
    ])
  ],
  controllers: [InventaireController],
  providers: [InventaireService]
})
export class InventaireModule {}
