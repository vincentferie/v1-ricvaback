import { HttpException } from "@nestjs/common";
import { responseRequest } from "src/helpers/core/response-request";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { EntityRepository, Repository } from "typeorm";
import { isDefined } from "class-validator";
import { CampagneOutturnEntity } from "./outturn.entity";
import { CampagneOutturnDto } from "./outturn.dto";

@EntityRepository(CampagneOutturnEntity)
export class CampagneOutturnRepository extends Repository<CampagneOutturnEntity> {
    // Fonction de save qui sera utiliser pour l'enregistrement simulatané
    async createDetail(inputDto: CampagneOutturnDto): Promise<CampagneOutturnEntity> {
        const { campagne_id, min_outtrun, max_outtrun, flag, created, created_by } = inputDto;
        const entity = new CampagneOutturnEntity();
        let exception;

        entity.campagne_id = campagne_id;
        entity.min_outtrun = min_outtrun;
        entity.max_outtrun = max_outtrun;
        entity.flag = flag;
        entity.created = created;
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

    async findById(id: string): Promise<CampagneOutturnEntity[]> {
        let exception;

        try {
            const found = await this.find({ campagne_id: id, mode: SoftDelete.active });

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

    async updateDetail(inputDto: CampagneOutturnDto): Promise<CampagneOutturnEntity> {
        const { id, campagne_id, min_outtrun, max_outtrun, flag, updated_by } = inputDto;
        const entity = new CampagneOutturnEntity();
        let exception;

        try {

            let found = await this.findOne({ id: id });
            if (isDefined(found)) {
                found.campagne_id = campagne_id;
                found.min_outtrun = min_outtrun;
                found.max_outtrun = max_outtrun;
                found.flag = flag;
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

    async deleteDetail(payload: any, id: string): Promise<CampagneOutturnEntity> {
        const entity = new CampagneOutturnEntity();
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