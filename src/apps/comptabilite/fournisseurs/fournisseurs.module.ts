import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FournisseursController } from './fournisseurs.controller';
import { FournisseursEntity } from './fournisseurs.entity';
import { FournisseursService } from './fournisseurs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FournisseursEntity])
  ],
  controllers: [FournisseursController],
  providers: [FournisseursService]
})
export class FournisseursModule {}
