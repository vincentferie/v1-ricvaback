import { HttpException } from "@nestjs/common";
import { responseRequest } from "src/helpers/core/response-request";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { EntityRepository, Repository } from "typeorm";
import { isDefined } from "class-validator";
import { PersonanlisationEntity } from "./personnalisation.entity";
import { PersonanlisationDto } from "./personnalisation.dto";

@EntityRepository(PersonanlisationEntity)
export class PersonanlisationRepository extends Repository<PersonanlisationEntity> {
    // Fonction de save qui sera utiliser pour l'enregistrement simulatané
    async createDetail(inputDto: PersonanlisationDto): Promise<PersonanlisationEntity> {
        const { groupement_id, main_color, sub_color, created_by } = inputDto;
        const entity = new PersonanlisationEntity();
        let exception;

        entity.groupement_id = groupement_id;
        entity.main_color = main_color;
        entity.sub_color = sub_color;
        entity.created = new Date(Date.now());
        entity.created_by = created_by;
        entity.mode = SoftDelete.active;

        try {
            await entity.save();
            return entity;
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
    }

    async findById(id: string): Promise<PersonanlisationEntity[]> {
        let exception;

        try {
            const found = await this.find({ groupement_id: id, mode: SoftDelete.active });

            return found;
        } catch (error) {
            if (error.code === '22P02') {
                exception = await responseRequest({
                    status: 'errorFound',
                    data: null,
                    params: error.message
                });
            } else {
                exception = await responseRequest({
                    status: 'errorOtherRequest',
                    data: null,
                    params: error.message //`Erreur de paramètre ${primaryKey}`
                });
            }
        }
        throw new HttpException(exception[0], exception[1]);

    }

    async updateDetail(inputDto: PersonanlisationDto): Promise<PersonanlisationEntity> {
        const { id, groupement_id, main_color, sub_color, updated_by } = inputDto;
        const entity = new PersonanlisationEntity();
        let exception;

        try {

            let found = await this.findOne({ id: id });
            if (isDefined(found)) {
                found.groupement_id = groupement_id;
                found.main_color = main_color;
                found.sub_color = sub_color;
                found.updated = new Date(Date.now());
                found.updated_by = updated_by;
                await found.save();
                return found;
            }
        } catch (error) {
            if (error.code === '23505') {
                // Duplucate 
                exception = await responseRequest({
                    status: 'errorUpdated',
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
    }

    async deleteDetail(payload: any, id: string): Promise<PersonanlisationEntity> {
        const entity = new PersonanlisationEntity();
        let exception;

        try {

            let found = await this.findOne({ id: id });
            if (isDefined(found)) {
                found.updated = new Date(Date.now());
                found.updated_by = `${payload.user.nom} ${payload.user.prenoms}`;;
                found.mode = SoftDelete.disable;
                await found.save();
                return found;
            }
        } catch (error) {
            if (error.code === '23505') {
                // Duplucate 
                exception = await responseRequest({
                    status: 'errorDeleted',
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
    }

}