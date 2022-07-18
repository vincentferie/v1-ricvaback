import { Double } from "typeorm";
import { CampagneSpecModel } from "../campagne-spec/campagne-spec.model";
import { CampagneOutturnDto } from "./outturn/outturn.dto";

export interface CampagneModel {
    id: string;
    speculation_id: string;
    libelle: string;
    prix_bord: Double;
    ouverture: Date;
    fermeture: Date;
    details: CampagneSpecModel[];
    outturn: CampagneOutturnDto[];
    created: Date;
    created_by: string;
    updated: Date;
    updated_by: string;
}
