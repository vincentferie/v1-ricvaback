export interface OperationDiverseModel{
    id: string;
    num_ordre: string;
    num_facture: string;
    libelle: string;
    description: string;
    montant_ht: number;
    montant_tva: number;
    date_facture: Date;
    created: Date;
    created_by: string;
    updated: Date;
    updated_by: string;
    debit: number;
    credit: number;

}