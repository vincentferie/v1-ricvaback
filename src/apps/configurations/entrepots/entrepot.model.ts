import { Double } from "typeorm";

export interface EntrepotModel {
    id: string;
    // exportateur_id: string;
    site_id: string;
    libelle: string;
    superficie: Double;
    coordonneex: Double;
    coordonneey: Double;
    created: Date;
    created_by: string;
    updated: Date;
    updated_by: string;
}