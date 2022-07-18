import { Injectable } from "@nestjs/common";
import { Logger } from "@nestjs/common";
import { AccountsService } from "src/apps/configurations/account/accounts.service";
import { BilanDataParamsService } from "src/apps/configurations/bilan-data-params/bilan-data-params.service";
import { BilanNumCompteService } from "src/apps/configurations/bilan-num-compte/bilan-num-compte.service";
import { BilanParamsService } from "src/apps/configurations/bilan-params/bilan-params.service";
import { CompteComptaFourService } from "src/apps/configurations/compte-compta-four/compte-compta-four.service";
import { CompteComptaOneService } from "src/apps/configurations/compte-compta-one/compte-compta-one.service";
import { CompteComptaThreeService } from "src/apps/configurations/compte-compta-three/compte-compta-three.service";
import { CompteComptaTwoService } from "src/apps/configurations/compte-compta-two/compte-compta-two.service";
import { CompteResultatParamsService } from "src/apps/configurations/compte-resultat-params/compte-resultat-params.service";
import { CompteResultatPosteService } from "src/apps/configurations/compte-resultat-poste/compte-resultat-poste.service";
import { DetailsSpeculationService } from "src/apps/configurations/details-speculation/details-speculation.service";
import { FluxTresorerieParamsService } from "src/apps/configurations/flux-tresorerie-params/flux-tresorerie-params.service";
import { FluxTresoreriePosteParamsService } from "src/apps/configurations/flux-tresorerie-poste-params/flux-tresorerie-poste-params.service";
import { IncotemsService } from "src/apps/configurations/incotems/incotems.service";
import { RolesService } from "src/apps/configurations/roles/roles.service";
import { SpeculationsService } from "src/apps/configurations/speculations/speculations.service";
import { VilleService } from "src/apps/configurations/ville/ville.service";
import { ZonageService } from "src/apps/configurations/zonage/zonage.service";

@Injectable()
export class Seeder {
  constructor(
    private readonly logger: Logger,
    private readonly seedZonageService: ZonageService,
    private readonly seedVilleService: VilleService,
    private readonly seedSpeculationService: SpeculationsService,
    private readonly seedDetailsSpeculationService: DetailsSpeculationService,
    private readonly seedRoleService: RolesService,
    private readonly seedIncotemsService: IncotemsService,
    private readonly seedAccountService: AccountsService,
    private readonly seedCompteOneService: CompteComptaOneService,
    private readonly seedCompteTwoService: CompteComptaTwoService,
    private readonly seedCompteThreeService: CompteComptaThreeService,
    private readonly seedCompteFourService: CompteComptaFourService,
    private readonly seedBilanParamsService: BilanParamsService,
    private readonly seedBilanDataParamsService: BilanDataParamsService,
    private readonly seedBilanNumParamsService: BilanNumCompteService,
    private readonly seedCompteResultatParamsService: CompteResultatParamsService,
    private readonly seedCompteResultatNumParamsService: CompteResultatPosteService,
    private readonly seedFluxParamsService: FluxTresorerieParamsService,
    private readonly seedFluxNumParamsService: FluxTresoreriePosteParamsService,
  ) {}
  async seed() {
    // Zonage
    await this.zonage()
            .then(completed => {
                this.logger.debug('Successfuly completed seeding zonage...');
                Promise.resolve(completed);
            })
            .catch(error => {
                this.logger.error('Failed seeding zonage...');
                Promise.reject(error);
            });

    // Ville
    await this.ville()
            .then(completed => {
                this.logger.debug('Successfuly completed seeding ville...');
                Promise.resolve(completed);
            })
            .catch(error => {
                this.logger.error('Failed seeding ville...');
                Promise.reject(error);
            });

    // Speculation
    await this.speculation()
            .then(completed => {
                this.logger.debug('Successfuly completed seeding speculation...');
                Promise.resolve(completed);
            })
            .catch(error => {
                this.logger.error('Failed seeding speculation...');
                Promise.reject(error);
            });

    // Details Speculation
    await this.detailSpeculation()
            .then(completed => {
                this.logger.debug('Successfuly completed seeding détails speculation...');
                Promise.resolve(completed);
            })
            .catch(error => {
                this.logger.error('Failed seeding détails speculation...');
                Promise.reject(error);
            });

    // Rôle
    await this.role()
            .then(completed => {
                this.logger.debug('Successfuly completed seeding rôle...');
                Promise.resolve(completed);
            })
            .catch(error => {
                this.logger.error('Failed seeding rôle...');
                Promise.reject(error);
            });

    // Incotems
    await this.incotems()
            .then(completed => {
                this.logger.debug('Successfuly completed seeding Incotems...');
                Promise.resolve(completed);
            })
            .catch(error => {
                this.logger.error('Failed seeding Incotems...');
                Promise.reject(error);
            });

    // Account
    await this.account()
            .then(completed => {
                this.logger.debug('Successfuly completed seeding Account...');
                Promise.resolve(completed);
            })
            .catch(error => {
                this.logger.error('Failed seeding Account...');
                Promise.reject(error);
            });

    // Account
    await this.account()
            .then(completed => {
                this.logger.debug('Successfuly completed seeding Account...');
                Promise.resolve(completed);
            })
            .catch(error => {
                this.logger.error('Failed seeding Account...');
                Promise.reject(error);
            });

    // Classe 1
    await this.compteLevelOne()
            .then(completed => {
                this.logger.debug('Successfuly completed seeding Classe 1...');
                Promise.resolve(completed);
            })
            .catch(error => {
                this.logger.error('Failed seeding Classe 1...');
                Promise.reject(error);
            });

    // Classe 2
    await this.compteLevelTwo()
            .then(completed => {
                this.logger.debug('Successfuly completed seeding Classe 2...');
                Promise.resolve(completed);
            })
            .catch(error => {
                this.logger.error('Failed seeding Classe 2...');
                Promise.reject(error);
            });

    // Classe 3
    await this.compteLevelThree()
            .then(completed => {
                this.logger.debug('Successfuly completed seeding Classe 3...');
                Promise.resolve(completed);
            })
            .catch(error => {
                this.logger.error('Failed seeding Classe 3...');
                Promise.reject(error);
            });

    // Classe 4
    await this.compteLevelFour()
            .then(completed => {
                this.logger.debug('Successfuly completed seeding Classe 4...');
                Promise.resolve(completed);
            })
            .catch(error => {
                this.logger.error('Failed seeding Classe 4...');
                Promise.reject(error);
            });

    // bilan Params
    await this.bilanParams()
            .then(completed => {
                this.logger.debug('Successfuly completed seeding bilan Params...');
                Promise.resolve(completed);
            })
            .catch(error => {
                this.logger.error('Failed seeding bilan Params...');
                Promise.reject(error);
            });
 
            
    // bilan Params Data
    await this.bilanDataParams()
            .then(completed => {
                this.logger.debug('Successfuly completed seeding bilan Params Data...');
                Promise.resolve(completed);
            })
            .catch(error => {
                this.logger.error('Failed seeding bilan Params Data...');
                Promise.reject(error);
            });

    // bilan Params Num
    // await this.bilanNumParams()
    //         .then(completed => {
    //             this.logger.debug('Successfuly completed seeding bilan Params Num...');
    //             Promise.resolve(completed);
    //         })
    //         .catch(error => {
    //             this.logger.error('Failed seeding bilan Params Num...');
    //             Promise.reject(error);
    //         });

    // Compte de resultat
    await this.compteResultatParams()
            .then(completed => {
                this.logger.debug('Successfuly completed seeding Compte de resultat...');
                Promise.resolve(completed);
            })
            .catch(error => {
                this.logger.error('Failed seeding Compte de resultat...');
                Promise.reject(error);
            });

        // Compte de resultat Num
    // await this.compteResultatNumParams()
    //         .then(completed => {
    //             this.logger.debug('Successfuly completed seeding Compte de resultat Num...');
    //             Promise.resolve(completed);
    //         })
    //         .catch(error => {
    //             this.logger.error('Failed seeding Compte de resultat Num...');
    //             Promise.reject(error);
    //         });

    // Flux de tresorerie
    await this.fluxTresorerieParams()
            .then(completed => {
                this.logger.debug('Successfuly completed seeding Flux de trésorerie...');
                Promise.resolve(completed);
            })
            .catch(error => {
                this.logger.error('Failed seeding Flux de trésorerie...');
                Promise.reject(error);
            });

        // Compte de resultat Num
    // await this.fluxTresorerieNumParams()
    //         .then(completed => {
    //             this.logger.debug('Successfuly completed seeding Flux de trésorerie Num...');
    //             Promise.resolve(completed);
    //         })
    //         .catch(error => {
    //             this.logger.error('Failed seeding Flux de trésorerie Num...');
    //             Promise.reject(error);
    //         });



  }

  async zonage() {
    return await Promise.all(this.seedZonageService.create())
      .then(result => {
        // Can also use this.logger.verbose('...');
        this.logger.debug(
          'No. of Zonage created : ' +
            // Remove all null values and return only created languages.
            result.filter(
              nullValueOrResult => nullValueOrResult,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch(error => Promise.reject(error));
  }

  async ville() {
    return await Promise.all(this.seedVilleService.create())
      .then(result => {
        // Can also use this.logger.verbose('...');
        this.logger.debug(
          'No. of Ville created : ' +
            // Remove all null values and return only created languages.
            result.filter(
              nullValueOrResult => nullValueOrResult,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch(error => Promise.reject(error));
  }

  async speculation() {
    return await Promise.all(this.seedSpeculationService.create())
      .then(result => {
        // Can also use this.logger.verbose('...');
        this.logger.debug(
          'No. of Spéculation created : ' +
            // Remove all null values and return only created languages.
            result.filter(
              nullValueOrResult => nullValueOrResult,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch(error => Promise.reject(error));
  }

  async detailSpeculation() {
    return await Promise.all(this.seedDetailsSpeculationService.create())
      .then(result => {
        // Can also use this.logger.verbose('...');
        this.logger.debug(
          'No. of Détails Spéculation created : ' +
            // Remove all null values and return only created languages.
            result.filter(
              nullValueOrResult => nullValueOrResult,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch(error => Promise.reject(error));
  }

  async role() {
    return await Promise.all(this.seedRoleService.create())
      .then(result => {
        // Can also use this.logger.verbose('...');
        this.logger.debug(
          'No. of Rôle created : ' +
            // Remove all null values and return only created languages.
            result.filter(
              nullValueOrResult => nullValueOrResult,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch(error => Promise.reject(error));
  }

  async incotems() {
    return await Promise.all(this.seedIncotemsService.create())
      .then(result => {
        // Can also use this.logger.verbose('...');
        this.logger.debug(
          'No. of Incotem created : ' +
            // Remove all null values and return only created languages.
            result.filter(
              nullValueOrResult => nullValueOrResult,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch(error => Promise.reject(error));
  }

  async account() {
    return await Promise.all(this.seedAccountService.create())
      .then(result => {
        // Can also use this.logger.verbose('...');
        this.logger.debug(
          'No. of Account created : ' +
            // Remove all null values and return only created languages.
            result.filter(
              nullValueOrResult => nullValueOrResult,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch(error => Promise.reject(error));
  }

  async compteLevelOne() {
    return await Promise.all(this.seedCompteOneService.create())
      .then(result => {
        // Can also use this.logger.verbose('...');
        this.logger.debug(
          'No. of Classe 1 created : ' +
            // Remove all null values and return only created languages.
            result.filter(
              nullValueOrResult => nullValueOrResult,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch(error => Promise.reject(error));
  }

  async compteLevelTwo() {
    return await Promise.all(this.seedCompteTwoService.create())
      .then(result => {
        // Can also use this.logger.verbose('...');
        this.logger.debug(
          'No. of Classe 2 created : ' +
            // Remove all null values and return only created languages.
            result.filter(
              nullValueOrResult => nullValueOrResult,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch(error => Promise.reject(error));
  }

  async compteLevelThree() {
    return await Promise.all(this.seedCompteThreeService.create())
      .then(result => {
        // Can also use this.logger.verbose('...');
        this.logger.debug(
          'No. of Classe 3 created : ' +
            // Remove all null values and return only created languages.
            result.filter(
              nullValueOrResult => nullValueOrResult,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch(error => Promise.reject(error));
  }

  async compteLevelFour() {
    return await Promise.all(this.seedCompteFourService.create())
      .then(result => {
        // Can also use this.logger.verbose('...');
        this.logger.debug(
          'No. of Classe 4 created : ' +
            // Remove all null values and return only created languages.
            result.filter(
              nullValueOrResult => nullValueOrResult,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch(error => Promise.reject(error));
  }

  async bilanParams() {
    return await Promise.all(this.seedBilanParamsService.create())
      .then(result => {
        // Can also use this.logger.verbose('...');
        this.logger.debug(
          'No. of Bilan Params created : ' +
            // Remove all null values and return only created languages.
            result.filter(
              nullValueOrResult => nullValueOrResult,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch(error => Promise.reject(error));
  }

  async bilanDataParams() {
    return await Promise.all(this.seedBilanDataParamsService.create())
      .then(result => {
        // Can also use this.logger.verbose('...');
        this.logger.debug(
          'No. of Bilan Params Data created : ' +
            // Remove all null values and return only created languages.
            result.filter(
              nullValueOrResult => nullValueOrResult,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch(error => Promise.reject(error));
  }

  async bilanNumParams() {
    return await Promise.all(this.seedBilanNumParamsService.create())
      .then(result => {
        // Can also use this.logger.verbose('...');
        this.logger.debug(
          'No. of Bilan Params Num created : ' +
            // Remove all null values and return only created languages.
            result.filter(
              nullValueOrResult => nullValueOrResult,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch(error => Promise.reject(error));
  }

  async compteResultatParams() {
    return await Promise.all(this.seedCompteResultatParamsService.create())
      .then(result => {
        // Can also use this.logger.verbose('...');
        this.logger.debug(
          'No. of Compte de resultat created : ' +
            // Remove all null values and return only created languages.
            result.filter(
              nullValueOrResult => nullValueOrResult,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch(error => Promise.reject(error));
  }

  async compteResultatNumParams() {
    return await Promise.all(this.seedCompteResultatNumParamsService.create())
      .then(result => {
        // Can also use this.logger.verbose('...');
        this.logger.debug(
          'No. of Compte de resultat Num created : ' +
            // Remove all null values and return only created languages.
            result.filter(
              nullValueOrResult => nullValueOrResult,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch(error => Promise.reject(error));
  }

  async fluxTresorerieParams() {
    return await Promise.all(this.seedFluxParamsService.create())
      .then(result => {
        // Can also use this.logger.verbose('...');
        this.logger.debug(
          'No. of Flux de trésorerie created : ' +
            // Remove all null values and return only created languages.
            result.filter(
              nullValueOrResult => nullValueOrResult,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch(error => Promise.reject(error));
  }

  async fluxTresorerieNumParams() {
    return await Promise.all(this.seedFluxNumParamsService.create())
      .then(result => {
        // Can also use this.logger.verbose('...');
        this.logger.debug(
          'No. of Flux de trésorerie Num Num created : ' +
            // Remove all null values and return only created languages.
            result.filter(
              nullValueOrResult => nullValueOrResult,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch(error => Promise.reject(error));
  }


}