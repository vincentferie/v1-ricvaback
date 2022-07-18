import { StateChargement } from 'src/helpers/enums/state.enum';
import { Double } from 'typeorm';
export interface ChargementModel {
    id: string;
    superviseur_id: string;
    campagne_id: string;
    provenance_id: string;
    zonage_id: string;
    exportateur_id: string;
    entrepot_id: string;
    speculation_id: string;
    num_fiche: string;
    date_chargement: Date;
    tracteur: string;
    remorque: string;
    fournisseur: string;
    contact_fournisseur: string;
    transporteur: string;
    statut: StateChargement;
    validity: boolean;  
    file: any;
    created: Date;
    created_by: string;
    updated: Date;
    updated_by: string;
}
