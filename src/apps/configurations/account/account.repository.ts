import { HttpException } from "@nestjs/common";
import { responseRequest } from "src/helpers/core/response-request";
import * as bcrypt from "bcrypt";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { EntityRepository, Repository } from "typeorm";
import { AccountDto } from "./account.dto";
import { AccountEntity } from "./account.entity";
import { AuthCredentialsDto } from "src/apps/auth/auth-credentials.dto";

@EntityRepository(AccountEntity)
export class AccountRepository extends Repository<AccountEntity> {
    // Fonction de save qui sera utiliser pour l'enregistrement simulatané
    async createDetail(userDto: AccountDto): Promise<AccountEntity> {
        const { role_id, nom, prenoms, contact, username, password, created_by } = userDto;
        const user = new AccountEntity();
        const salt = await bcrypt.genSalt();

        let exception;

        user.role_id = role_id;
        user.nom = nom;
        user.prenoms = prenoms;
        user.contact = contact;
        user.username = username;
        user.password = await this.hashPassword(password, salt);
        user.salt = salt;
        user.created_by = created_by;
        user.created = new Date(Date.now());
        user.mode = SoftDelete.active;

        try {
            await user.save();
        } catch (error) {
            if (error.code === '23505') {
                // Duplucate 
                exception = await responseRequest({
                    status: 'errorInserted',
                    data: null,
                    params: error.detail
                });
            } else if (error.code === '22001') {
                exception = await responseRequest({
                    status: 'errorPayload',
                    data: null,
                    params: `${error.length} mots saisies excèdent la limite de taille autorisée.`
                });
            } else {
                exception = await responseRequest({
                    status: 'errorOtherRequest',
                    data: null,
                    params: error[0].constraints
                });
            }

            throw new HttpException(exception[0], exception[1]);
        }

        return user;
    }

    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { username, password } = authCredentialsDto;
        const user = await this.findOne({ username });

        if (user && await user.validatePassword(password)) {
            return user.id;
        } else {
            return null;
        }
    }
    
    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}