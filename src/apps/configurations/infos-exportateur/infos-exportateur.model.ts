import { Double } from "typeorm";

export interface InfosExportateurModel {
    id: string;
    raison: string;
    contribuable: string;
    contact: string;
    email: string;
    postal: string;
    lieu: string;
    coord_x: Double;
    coord_y: Double;
    created: Date;
    created_by: string;
    updated: Date;
    updated_by: string;
}
