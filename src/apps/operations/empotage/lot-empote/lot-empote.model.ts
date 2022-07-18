import { SoftDelete } from "src/helpers/enums/softdelete.enum";

export interface LotEmpoteModel {
    id: string;
    empotage_id: string;
    lot_id: string;
    nbre_sacs: number;
    created: Date;
    created_by: string;
    updated: Date;
    updated_by: string;
    mode: SoftDelete
}
