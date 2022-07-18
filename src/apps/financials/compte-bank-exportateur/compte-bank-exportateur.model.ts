import { StateTirage } from "src/helpers/enums/state.enum";

export interface CompteBankExportateurModel{
    id: string;
    campagne_id: string;
    exportateur_id: string;
    banque_id: string;
    numero: string;
    solde: number;
    date_tirage: Date;
    type: StateTirage;
    created: Date;
}