export interface AccountModel {
    id: string;
    role_id: string;
    nom: string;
    prenoms: string;
    contact: string;
    username: string;
    password: string;
    created: Date;
    created_by: string;
    updated: Date;
    updated_by: string;
}
