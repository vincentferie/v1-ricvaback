import { DetailBlModel } from "./details-bl/detail-bl.model";

export interface BonLivraisonModel {
    id: string;
    groupement_id: string;
    numero_voyage: string;
    numero_bl: string;
    destination: string;
    provenance: string;
    amateur: string;
    nom_client: string;
    adresse_client: string;
    pays_client: string;
    port_depart: string;
    port_arrive: string;
    date_embarquement: Date;
    details: DetailBlModel[];
    file: any;
    created: Date;
    created_by: string;
    updated: Date;
    updated_by: string;
}