import { HttpException } from "@nestjs/common";
import { responseRequest } from "src/helpers/core/response-request";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { EntityRepository, Repository } from "typeorm";
import { isDefined } from "class-validator";
import { LotEmpoteEntity } from "./lot-empote.entity";
import { LotEmpoteDto } from "./lot-empote.dto";

@EntityRepository(LotEmpoteEntity)
export class LotEmpoteRepository extends Repository<LotEmpoteEntity> {
    // Fonction de save qui sera utiliser pour l'enregistrement simulatané
    async createDetail(inputDto: LotEmpoteDto): Promise<LotEmpoteEntity> {
        const { empotage_id, lot_id, nbre_sacs, created_by} = inputDto;
        const entity = new LotEmpoteEntity();
        let exception;

        entity.empotage_id = empotage_id;
        entity.lot_id = lot_id;
        entity.nbre_sacs = nbre_sacs;
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

        return entity;
    }

    async findById(id: string): Promise<LotEmpoteEntity[]> {
        let exception;

        try {
            const found = await this.find({ empotage_id: id, mode: SoftDelete.active });

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

    async updateDetail(inputDto: LotEmpoteDto): Promise<LotEmpoteEntity> {
        const { id, empotage_id, lot_id, nbre_sacs, updated_by} = inputDto;
        const entity = new LotEmpoteEntity();
        let exception;
        try {

            let found = await this.findOne({ id: id });
            if (isDefined(found)) {
                found.empotage_id = empotage_id;
                found.lot_id = lot_id;
                found.nbre_sacs = nbre_sacs;
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

    async deleteDetail(payload: any, id: string): Promise<LotEmpoteEntity> {
        const entity = new LotEmpoteEntity();
        let exception;

        try {

            let found = await this.findOne({ id: id });
            if (isDefined(found)) {
                found.updated = new Date(Date.now());
                found.updated_by = `${payload.user.nom} ${payload.user.prenoms}`;
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