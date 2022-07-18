import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { Double } from "typeorm";
export interface DetailBlModel {
    id: string;
    bon_livraison_id: string;
    conteneur_id: string;
    plomb_id: string;
    nbr_sacs: number;
    gross_weight: Double;
    tare: Double;
    measurement: Double;
    created: Date;
    created_by: string;
    updated: Date;
    updated_by: string;
    mode: SoftDelete
}
