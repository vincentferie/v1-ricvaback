export interface TransfertModel {
    id: string;
    lot_id: string;
    site_provenance_id: string;
    site_destination_id: string;
    poidsNetMq: number;
    sacMq: number;
    poidsNetDechet: number;
    sacDechet: number;
    poidsNetPoussiere: number;
    sacPoussiere: number;
    totalSacTrie: number;
    statutTriage: string;
    created: Date;
    created_by: string;
    updated: Date;
    updated_by: string;
}
