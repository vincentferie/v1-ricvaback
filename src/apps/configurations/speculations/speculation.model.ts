import { DetailsSpeculationModel } from "../details-speculation/detail-speculation.model";

export interface SpeculationModel {
    id: string;
    libelle: string;
    usinage: boolean;
    details: DetailsSpeculationModel;
    created: Date;
    created_by: string;
    updated: Date;
    updated_by: string;
}
