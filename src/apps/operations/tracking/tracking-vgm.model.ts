export interface TrackingVgmModel {
    id: string;
    campagne_id: string;
    job_id: string;
    job_name: string;
    conteneur: string;
    booking: string;
    ligne_maritime: string;
    poids: number;
    pont_bascule: string;
    edition: string;
    emission: string;
    statut: boolean;
    created: Date;
    created_by: string;
    updated: Date;
    updated_by: string;
}