import { PersonanlisationDto } from "./personnalisation/personnalisation.dto";

export interface GroupementModel {
    id: string;
    libelle: string;
    description: string;
    contribuable: string;
    contact: string;
    email: string;
    postal: string;
    lieu: string;
    logo: any;
    personnalisation: PersonanlisationDto;
    created: Date;
    created_by: string;
    updated: Date;
    updated_by: string;

}
