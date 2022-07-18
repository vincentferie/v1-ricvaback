import { Module } from '@nestjs/common';
import { Logger } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from 'src/apps/configurations/account/accounts.module';
import { BilanDataParamsModule } from 'src/apps/configurations/bilan-data-params/bilan-data-params.module';
import { BilanNumCompteModule } from 'src/apps/configurations/bilan-num-compte/bilan-num-compte.module';
import { BilanParamsModule } from 'src/apps/configurations/bilan-params/bilan-params.module';
import { CompteComptaFourModule } from 'src/apps/configurations/compte-compta-four/compte-compta-four.module';
import { CompteComptaOneModule } from 'src/apps/configurations/compte-compta-one/compte-compta-one.module';
import { CompteComptaThreeModule } from 'src/apps/configurations/compte-compta-three/compte-compta-three.module';
import { CompteComptaTwoModule } from 'src/apps/configurations/compte-compta-two/compte-compta-two.module';
import { CompteResultatParamsModule } from 'src/apps/configurations/compte-resultat-params/compte-resultat-params.module';
import { CompteResultatPosteModule } from 'src/apps/configurations/compte-resultat-poste/compte-resultat-poste.module';
import { DetailsSpeculationModule } from 'src/apps/configurations/details-speculation/details-speculation.module';
import { FluxTresorerieParamsModule } from 'src/apps/configurations/flux-tresorerie-params/flux-tresorerie-params.module';
import { FluxTresoreriePosteParamsModule } from 'src/apps/configurations/flux-tresorerie-poste-params/flux-tresorerie-poste-params.module';
import { IncotemsModule } from 'src/apps/configurations/incotems/incotems.module';
import { RolesModule } from 'src/apps/configurations/roles/roles.module';
import { SpeculationsModule } from 'src/apps/configurations/speculations/speculations.module';
import { VilleModule } from 'src/apps/configurations/ville/ville.module';
import { ZonageModule } from 'src/apps/configurations/zonage/zonage.module';
import { typeOrmConfig } from 'src/config/typeorm.config';
import { Seeder } from "./seeder";

/**
 * Import and provide seeder classes.
 *
 * @module
 */
@Module({
    imports: [
        TypeOrmModule.forRoot(typeOrmConfig),
        ZonageModule,
        VilleModule,
        SpeculationsModule,
        DetailsSpeculationModule,
        RolesModule,
        IncotemsModule,
        AccountsModule,
        CompteComptaOneModule,
        CompteComptaTwoModule,
        CompteComptaThreeModule,
        CompteComptaFourModule,
        BilanParamsModule,
        BilanDataParamsModule,
        BilanNumCompteModule,
        CompteResultatParamsModule,
        CompteResultatPosteModule,
        FluxTresorerieParamsModule,
        FluxTresoreriePosteParamsModule
    ],
    providers: [Logger, Seeder],
  })
export class SeederModule {}