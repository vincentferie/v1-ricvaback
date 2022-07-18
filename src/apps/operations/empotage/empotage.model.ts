import { StateEmpotage } from 'src/helpers/enums/state.enum';
import { Double } from 'typeorm';
import { LotEmpoteDto } from './lot-empote/lot-empote.dto';
export interface EmpotagesModel {
    id: string;
    entrepot_id: string;
    transitaire_id: string;
    booking_id: string;
    conteneur_id: string;
    date_empotage: Date;
    ot: string;
    tare: number;
    out_turn: Double;
    details: LotEmpoteDto[];
    statut: StateEmpotage;
    created: Date;
    created_by: string;
    updated: Date;
    updated_by: string;
}
