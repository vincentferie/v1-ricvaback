import { Double } from "typeorm";

export interface FactureBlModel {
id: string;
campagne_id: string;
client_id: string;
contrat_id: string;
bl_id: string;
invoice: string;
port_load: string;
port_discharge: string;
total_container: number;
total_bags: number;
gross_weight: number;
net_weight: number;
qty_mts: Double;
unit_price: Double;
amount: Double;
amount_chargeable_percent: Double;
amount_chargeable: Double;
date_contrat: Date;
date_invoice: Date;
bl: any;
created: Date;
created_by: string;
updated: Date;
updated_by: string;
}