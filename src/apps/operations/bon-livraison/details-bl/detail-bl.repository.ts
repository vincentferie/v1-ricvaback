import { HttpException } from "@nestjs/common";
import { responseRequest } from "src/helpers/core/response-request";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { EntityRepository, Repository } from "typeorm";
import { isDefined } from "class-validator";
import { DetailBlEntity } from './detail-bl.entity';
import { DetailBlDto } from "./detail-bl.dto";

@EntityRepository(DetailBlEntity)
export class DetailsBonLivraisonRepository extends Repository<DetailBlEntity> {
    // Fonction de save qui sera utiliser pour l'enregistrement simulatané
    
    async createDetail(inputDto: DetailBlDto): Promise<DetailBlEntity> {
        const { bon_livraison_id, conteneur_id, plomb_id, nbr_sacs, gross_weight, tare, measurement, created_by } = inputDto;
        const entity = new DetailBlEntity();
        let exception;

        entity.bon_livraison_id = bon_livraison_id;
        entity.conteneur_id = conteneur_id;
        entity.plomb_id = plomb_id;
        entity.nbr_sacs = nbr_sacs;
        entity.gross_weight = gross_weight;
        entity.tare = tare;
        entity.measurement = measurement;
        entity.created_by = created_by;
        entity.created = new Date(Date.now());
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

    async findById(id: string): Promise<DetailBlEntity[]> {
        let exception;

        try {
            const found = await this.find({ bon_livraison_id: id, mode: SoftDelete.active });

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

    async updateDetail(inputDto: DetailBlDto): Promise<DetailBlEntity> {
        const { id, bon_livraison_id, conteneur_id, plomb_id, nbr_sacs, gross_weight, tare, measurement, updated_by } = inputDto;
        const entity = new DetailBlEntity();
        let exception;

        try {

            let found = await this.findOne({ id: id });
            if (isDefined(found)) {
                found.bon_livraison_id = bon_livraison_id;
                found.conteneur_id = conteneur_id;
                found.plomb_id = plomb_id;
                found.nbr_sacs = nbr_sacs;
                found.gross_weight = gross_weight;
                found.tare = tare;
                found.measurement = measurement;
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

    async deleteDetail(payload:any, id: string): Promise<DetailBlEntity> {
        const entity = new DetailBlEntity();
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