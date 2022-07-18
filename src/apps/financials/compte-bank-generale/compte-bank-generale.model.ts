import { StateTirage } from "src/helpers/enums/state.enum";

export interface CompteBankGeneraleModel{
    id: string;
    campagne_id: string;
    groupement_id: string;
    banque_id: string;
    numero: string;
    solde: number;
    date_tirage: Date;
    type: StateTirage;
    created: Date;
    created_by: string;
    updated: Date;
    updated_by: string;
}