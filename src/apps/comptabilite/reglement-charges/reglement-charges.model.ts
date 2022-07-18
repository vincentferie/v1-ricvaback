export interface ReglementChargesModel{
    id: string;
    charge_id: string;
    banque_id: string;
    type_charge_id: string;
    montant: number;
    date_reglement: Date;
    created: Date;
    created_by: string;
    updated: Date;
    updated_by: string;
    debit: number;
    credit: number;
}