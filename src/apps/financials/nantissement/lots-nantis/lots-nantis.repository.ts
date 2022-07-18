import { HttpException } from "@nestjs/common";
import { responseRequest } from "src/helpers/core/response-request";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { EntityRepository, Repository } from "typeorm";
import { LotsNantisEntity } from "./lots-nantis.entity";
import { LotsNantisDto } from "./lots-nantis.dto";
import { isDefined } from "class-validator";

@EntityRepository(LotsNantisEntity)
export class LotsNantisRepository extends Repository<LotsNantisEntity> {
    // Fonction de save qui sera utiliser pour l'enregistrement simulatané
    async createDetail(inputDto: LotsNantisDto): Promise<LotsNantisEntity> {
        const { nantissement_id, lot_id, date_nantissement, created_by } = inputDto;
        const entity = new LotsNantisEntity();
        let exception;

        entity.nantissement_id = nantissement_id;
        entity.lot_id = lot_id;
        entity.date_nantissement = date_nantissement;
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

    async findById(id: string): Promise<LotsNantisEntity[]> {
        let exception;

    try {
            const found =  await this.find({nantissement_id: id, mode: SoftDelete.active});
            
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

    async updateDetail(inputDto: LotsNantisDto): Promise<LotsNantisEntity> {
        const { id, nantissement_id, lot_id, date_nantissement, updated_by } = inputDto;
        const entity = new LotsNantisEntity();
        let exception;

        try {
            
            let found =  await this.findOne({id: id});
                if(isDefined(found)){
                    found.nantissement_id = nantissement_id;
                    found.lot_id = lot_id;
                    found.date_nantissement = date_nantissement;
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

    async deleteDetail(payload: any, id: string): Promise<LotsNantisEntity> {
        const entity = new LotsNantisEntity();
        let exception;

        try {
            
            let found =  await this.findOne({id: id});
                if(isDefined(found)){
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