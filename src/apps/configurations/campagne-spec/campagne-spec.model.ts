import { Double } from "typeorm";

export interface CampagneSpecModel {
    id: string;
    campagne_id: string;
    libelle: string;
    valeur: Double;
    tag: string;
    created: Date;
    created_by: string;
    updated: Date;
    updated_by: string;
}
