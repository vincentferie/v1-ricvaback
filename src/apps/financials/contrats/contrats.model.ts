import { Double } from "typeorm";

export interface ContratsModel {
id: string;
campagne_id: string;
client_id: string;
incotem_id: string;
groupement_id: string;
code: string;
quantity_value: Double;
quantity_percent_min_max: Double;
outturn: Double;
nutcount: Double;
moisture: Double;
foreign_matter: Double;
price: Double;
discount: string;
rejection: string;
payment_deposit: Double;
payment_shipped: Double;
signature: Date;
contrat: any;
created: Date;
created_by: string;
updated: Date;
updated_by: string;
}