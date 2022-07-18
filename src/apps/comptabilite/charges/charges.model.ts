export interface ChargesModel{
    id: string;
    fournisseur_id: string;
    type_charge_id: string;
    site_id: string;
    bl_id: string;
    num_ordre: string;
    num_facture: string;
    libelle: string;
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