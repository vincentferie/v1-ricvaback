import { StateLots } from "src/helpers/enums/state.enum";
import { LotsNantisModel } from "./lots-nantis/lots-nantis.model";

export interface NantissementModel {
    id: string;
    campagne_id: string;
    banque_id: string;
    tiers_id: string;
    numero_lettre: string;
    montant: number;
    date_nantissement: Date;
    statut: StateLots;
    lots: LotsNantisModel[];
    lettre: any;
    created: Date;
    created_by: string;
    updated: Date;
    updated_by: string;
}
