import { Double } from "typeorm";

export interface ReglementsFactureBlModel {
    id: string;
    campagne_id: string;
    facture_bl_id: string;
    banque_id: string;
    currency: string;
    currency_value: Double;
    amount: Double;
    date_reglement: Date;
    created: Date;
    created_by: string;
    updated: Date;
    updated_by: string;
}