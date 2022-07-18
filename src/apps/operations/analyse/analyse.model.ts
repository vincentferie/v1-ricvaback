import { Double } from "typeorm";
export interface AnalysesModel {
    id: string;
    lot_id: string;
    out_turn: Double;
    grainage: number;
    th: Double;
    created: Date;
    created_by: string;
    updated: Date;
    updated_by: string;
}
