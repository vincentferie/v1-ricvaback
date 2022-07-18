export interface FournisseursModel{
    id: string;
    transitaire_id: string;
    client_id: string;
    exportateur_id: string;
    code: string;
    raison_social: string;
    denomination: string;
    localisation: string;
    activite: string;
    contact: string;
    created: Date;
    created_by: string;
    updated: Date;
    updated_by: string;
}