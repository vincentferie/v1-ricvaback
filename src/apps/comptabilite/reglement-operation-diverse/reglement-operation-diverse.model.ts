export interface ReglementOperationDiverseModel{
    id: string;
    charge_ops_id: string;
    montant: number;
    description: string;
    date_reglement: Date;
    created: Date;
    created_by: string;
    updated: Date;
    updated_by: string;
    debit: number;
    credit: number;
}