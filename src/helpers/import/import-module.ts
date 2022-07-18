import { SpeculationsModule } from '../../apps/configurations/speculations/speculations.module';
import { DetailsSpeculationModule } from '../../apps/configurations/details-speculation/details-speculation.module';
import { InfosExportateurModule } from '../../apps/configurations/infos-exportateur/infos-exportateur.module';
import { AccountsModule } from '../../apps/configurations/account/accounts.module';
import { RolesModule } from '../../apps/configurations/roles/roles.module';
import { CompteComptaOneModule } from '../../apps/configurations/compte-compta-one/compte-compta-one.module';
import { CompteComptaTwoModule } from '../../apps/configurations/compte-compta-two/compte-compta-two.module';
import { CompteComptaThreeModule } from '../../apps/configurations/compte-compta-three/compte-compta-three.module';
import { CompteComptaFourModule } from '../../apps/configurations/compte-compta-four/compte-compta-four.module';
import { BilanParamsModule } from '../../apps/configurations/bilan-params/bilan-params.module';
import { BilanNumCompteModule } from '../../apps/configurations/bilan-num-compte/bilan-num-compte.module';
import { BilanDataParamsModule } from '../../apps/configurations/bilan-data-params/bilan-data-params.module';
import { CompteResultatParamsModule } from '../../apps/configurations/compte-resultat-params/compte-resultat-params.module';
import { CompteResultatPosteModule } from '../../apps/configurations/compte-resultat-poste/compte-resultat-poste.module';
import { FluxTresorerieParamsModule } from '../../apps/configurations/flux-tresorerie-params/flux-tresorerie-params.module';
import { FluxTresoreriePosteParamsModule } from '../../apps/configurations/flux-tresorerie-poste-params/flux-tresorerie-poste-params.module';
import { CampagneModule } from '../../apps/configurations/campagne/campagne.module';
import { CampagneSpecModule } from '../../apps/configurations/campagne-spec/campagne-spec.module';
import { GroupementModule } from '../../apps/configurations/groupement/groupement.module';
import { ClientsModule } from '../../apps/financials/clients/clients.module';
import { ContratsModule } from '../../apps/financials/contrats/contrats.module';
import { TransitairesModule } from '../../apps/comptabilite/transitaires/transitaires.module';
import { TrackingBlModule } from '../../apps/operations/tracking/tracking.module';
import { FactureBlModule } from '../../apps/financials/facture-bl/facture-bl.module';
import { ReglementFacturesBlModule } from '../../apps/financials/reglement-factures-bl/reglement-factures-bl.module';
import { ChargementsModule } from '../../apps/operations/chargements/chargements.module';
import { LotsModule } from '../../apps/operations/lots/lots.module';
import { TransfertsModule } from '../../apps/operations/transfert/transfert.module';
import { BookingModule } from '../../apps/operations/booking/booking.module';
import { ConteneursModule } from '../../apps/operations/conteneur/conteneur.module';
import { EmpotagesModule } from '../../apps/operations/empotage/empotage.module';
import { BalayureModule } from '../../apps/operations/balayure/balayure.module';
import { BalanceModule } from '../../apps/operations/balance/balance.module';
import { BanquesModule } from '../../apps/financials/banques/banques.module';
import { BanquesSpecModule } from '../../apps/financials/banques-spec/banques-spec.module';
import { CompteBankGeneraleModule } from '../../apps/financials/compte-bank-generale/compte-bank-generale.module';
import { ExportateursGroupementModule } from '../../apps/configurations/exportateurs-groupement/exportateurs-groupement.module';
import { CompteBankExportateurModule } from '../../apps/financials/compte-bank-exportateur/compte-bank-exportateur.module';
import { SubContratsModule } from '../../apps/financials/sub-contrats/sub-contrats.module';
import { TiersDetenteurModule } from '../../apps/financials/tiers-detenteur/tiers-detenteur.module';
import { NantissementModule } from '../../apps/financials/nantissement/nantissement.module';
import { DenantissementModule } from '../../apps/financials/denantissement/denantissement.module';
import { IncotemsModule } from '../../apps/configurations/incotems/incotems.module';
import { TypeChargesModule } from '../../apps/configurations/type-charges/type-charges.module';
import { FournisseursModule } from '../../apps/comptabilite/fournisseurs/fournisseurs.module';
import { ChargesModule } from '../../apps/comptabilite/charges/charges.module';
import { ReglementChargesModule } from '../../apps/comptabilite/reglement-charges/reglement-charges.module';
import { OperationDiverseModule } from '../../apps/comptabilite/operation-diverse/operation-diverse.module';
import { ReglementOperationDiverseModule } from '../../apps/comptabilite/reglement-operation-diverse/reglement-operation-diverse.module';
import { BilanComptableModule } from '../../apps/comptabilite/bilan-comptable/bilan-comptable.module';
import { CompteResultatModule } from '../../apps/comptabilite/compte-resultat/compte-resultat.module';
import { FluxTresorerieModule } from '../../apps/comptabilite/flux-tresorerie/flux-tresorerie.module';
import { RubriqueChargesModule } from '../../apps/configurations/rubrique-charges/rubrique-charges.module';
import { EntrepotsModule } from '../../apps/configurations/entrepots/entrepots.module';
import { SitesModule } from '../../apps/configurations/sites/sites.module';
import { PlombsModule } from '../../apps/operations/plomb/plomb.module';
import { TicketRelevageModule } from '../../apps/operations/ticket-relevage/ticket-relevage.module';
import { BonLivraisonModule } from '../../apps/operations/bon-livraison/bon-livraison.module';
import { ZonageModule } from '../../apps/configurations/zonage/zonage.module';
import { AnalysesModule } from '../../apps/operations/analyse/analyse.module';
import { SuiviEngagementsModule } from 'src/apps/financials/suivi-engagements/suivi-engagements.module';
import { RapportExportateurModule } from 'src/apps/operations/rapport-exportateur/rapport-exportateur.module';
import { InventaireModule } from 'src/apps/operations/inventaire/inventaire.module';
import { SuiviActiviteModule } from 'src/apps/operations/suivi-activite/suivi-activite.module';
import { VilleModule } from 'src/apps/configurations/ville/ville.module';
import { RefreshTokenModule } from 'src/apps/configurations/refresh-token/refresh-token.module';
import { AuthModule } from 'src/apps/auth/auth.module';
import { SessionModule } from 'src/apps/operations/session/session.module';
import { EtatChargesModule } from 'src/apps/comptabilite/etat-charges/etat-charges.module';

export const moduleApps = [
    AuthModule,
    SpeculationsModule,
    DetailsSpeculationModule,
    InfosExportateurModule,
    RolesModule,
    AccountsModule,
    CompteComptaOneModule,
    CompteComptaTwoModule,
    CompteComptaThreeModule,
    CompteComptaFourModule,
    BilanParamsModule,
    BilanNumCompteModule,
    BilanDataParamsModule,
    CompteResultatParamsModule,
    CompteResultatPosteModule,
    FluxTresorerieParamsModule,
    FluxTresoreriePosteParamsModule,
    CampagneModule,
    CampagneSpecModule,
    GroupementModule,
    ClientsModule,
    ContratsModule,
    TransitairesModule,
    TrackingBlModule,
    FactureBlModule,
    ReglementFacturesBlModule,
    ChargementsModule,
    LotsModule,
    TransfertsModule,
    BookingModule,
    ConteneursModule,
    EmpotagesModule,
    BalayureModule,
    BalanceModule,
    BanquesModule,
    BanquesSpecModule,
    CompteBankGeneraleModule,
    ExportateursGroupementModule,
    CompteBankExportateurModule,
    SubContratsModule,
    TiersDetenteurModule,
    NantissementModule,
    DenantissementModule,
    IncotemsModule,
    TypeChargesModule,
    FournisseursModule,
    ChargesModule,
    ReglementChargesModule,
    OperationDiverseModule,
    ReglementOperationDiverseModule,
    BilanComptableModule,
    CompteResultatModule,
    FluxTresorerieModule,
    RubriqueChargesModule,
    EntrepotsModule,
    SitesModule,
    PlombsModule,
    TicketRelevageModule,
    BonLivraisonModule,
    ZonageModule,
    AnalysesModule,
    SuiviEngagementsModule,
    RapportExportateurModule,
    InventaireModule,
    SuiviActiviteModule,
    VilleModule,
    RefreshTokenModule,
    BonLivraisonModule,
    SessionModule,
    EtatChargesModule
];