export interface DenantissementModel {
    id: string;
    campagne_id: string;
    nantissement_id: string;
    montant: number;
    interet: number;
    fob: number;
    date_denantissement: Date;
    created: Date;
    created_by: string;
    updated: Date;
    updated_by: string;
}
