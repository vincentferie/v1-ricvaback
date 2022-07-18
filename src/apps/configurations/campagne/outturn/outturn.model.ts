import { Double } from "typeorm";

export interface CampagneOutturnModel {
    id: string;
    campagne_id: string;
    min_outtrun: Double;
    max_outtrun: Double;
    flag: string;
    created: Date;
    created_by: string;
    updated: Date;
    updated_by: string;

}
