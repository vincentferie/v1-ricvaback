
import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isDefined } from 'class-validator';
import { responseRequest } from 'src/helpers/core/response-request';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { TypeOrmHttpParamQuery } from 'src/helpers/core/typeorm-query';
import { BalayureEntity } from './balayure.entity';
import { BalayureModel } from './balayure.model';

@Injectable()
export class BalayureService {

    constructor(
        @InjectRepository(BalayureEntity) private readonly entityRepository: Repository<BalayureEntity>,
    ) { }

    async save(payload: any, input: BalayureModel): Promise<BalayureEntity> {
        let result: any, exception: any;
        try {
            result = await this.entityRepository.save(input);
            if (isDefined(result)) {
                exception = await responseRequest({
                    status: 'inserted',
                    data: result,
                    params: null
                });
            }

        } catch (error) {
            if (error.code === '23505') {
                // Duplucate 
                exception = await responseRequest({
                    status: 'errorInserted',
                    data: result,
                    params: error.detail
                });
            } else if (error.code === '22001') {
                exception = await responseRequest({
                    status: 'errorPayload',
                    data: result,
                    params: `${error.length} mots saisies excèdent la limite de taille autorisée.`
                });
            } else {
                exception = await responseRequest({
                    status: 'errorOtherRequest',
                    data: error,
                    params: error.message
                });
            }
        }

        throw new HttpException(exception[0], exception[1]);
    }

    async update(payload: any, input: object, primaryKey: string): Promise<BalayureEntity> {
        let exception: any, result: any;
        const response = await this.checkById(primaryKey);

        if (!isDefined(response)) {
            exception = await responseRequest({
                status: 'errorFound',
                data: response,
                params: `Aucun element ne correspont au paramètre ${primaryKey}`
            });
            throw new HttpException(exception[0], exception[1]);

        }

        try {
            result = await this.entityRepository.save({ ...response.data, ...input });

            if (isDefined(result)) {
                exception = await responseRequest({
                    status: 'updated',
                    data: result,
                    params: null
                });
            }

        } catch (error) {
            exception = await responseRequest({
                status: 'errorUpdated',
                data: result,
                params: error
            });
        }

        throw new HttpException(exception[0], exception[1]);
    }

    async updateMode(payload: any, primaryKey: string, mode: SoftDelete): Promise<BalayureEntity> {
        let exception: any, result: any;
        const response = await this.checkById(primaryKey);

        if (!isDefined(response)) {
            exception = await responseRequest({
                status: 'errorFound',
                data: response,
                params: `Aucun element ne correspont au paramètre ${primaryKey}`
            });
            throw new HttpException(exception[0], exception[1]);

        }

        try {
            response.data.mode = mode;
            response.data.updated = new Date(Date.now());
            response.data.updated_by = `${payload.user.nom} ${payload.user.prenoms}`;
            result = await this.entityRepository.save(response.data);

            if (isDefined(result)) {
                exception = await responseRequest({
                    status: 'updated',
                    data: result,
                    params: null
                });
            }

        } catch (error) {
            exception = await responseRequest({
                status: 'errorUpdated',
                data: result,
                params: error
            });
        }

        throw new HttpException(exception[0], exception[1]);

    }

    async delete(payload: any, primaryKey: string): Promise<void> {
        let exception: any, result: any;
        const response = await this.checkById(primaryKey);

        if (!isDefined(response)) {
            exception = await responseRequest({
                status: 'errorFound',
                data: response,
                params: `Aucun element ne correspont au paramètre ${primaryKey}`
            });
            throw new HttpException(exception[0], exception[1]);

        }
        try {
            result = await this.entityRepository.delete(primaryKey);

            if (isDefined(result)) {
                exception = await responseRequest({
                    status: 'deleted',
                    data: result,
                    params: null
                });
            }

        } catch (error) {
            exception = await responseRequest({
                status: 'errorDeleted',
                data: result,
                params: error
            });
        }

        throw new HttpException(exception[0], exception[1]);

    }

    async softDelete(payload: any, primaryKey: string): Promise<void> {
        let exception: any, result: any;
        const response = await this.checkById(primaryKey);

        if (!isDefined(response)) {
            exception = await responseRequest({
                status: 'errorFound',
                data: response,
                params: `Aucun element ne correspont au paramètre ${primaryKey}`
            });
            throw new HttpException(exception[0], exception[1]);

        }

        try {
            response.data.mode = SoftDelete.disable;
            response.data.updated = new Date(Date.now());
            response.data.updated_by = `${payload.user.nom} ${payload.user.prenoms}`;
            result = await this.entityRepository.save(response.data);

            if (isDefined(result)) {
                exception = await responseRequest({
                    status: 'deleted',
                    data: result,
                    params: null
                });
            }

        } catch (error) {
            exception = await responseRequest({
                status: 'errorDeleted',
                data: result,
                params: error
            });
        }

        throw new HttpException(exception[0], exception[1]);
    }

    async find(payload: any, query: object): Promise<BalayureEntity[]> {
        let exception: any, result: any;

        try {
            result = await this.entityRepository.find(TypeOrmHttpParamQuery(query));
            if (isDefined(result)) {
                exception = await responseRequest({
                    status: 'foundQuery',
                    data: result,
                    params: result.length
                });
            }

        } catch (error) {
            if (error.code === '22P02') {
                exception = await responseRequest({
                    status: 'errorFound',
                    data: result,
                    params: error.message
                });
            } else {
                exception = await responseRequest({
                    status: 'errorOtherRequest',
                    data: error,
                    params: `Erreur de paramètre ${JSON.stringify(query)}`
                });
            }
        }
        throw new HttpException(exception[0], exception[1]);

    }

    async findPaginate(payload: any, query: any): Promise<BalayureEntity[]>{
        let exception: any, result: any, total: number;
        try {
            [result, total] = await this.entityRepository.findAndCount({
                where: [
                    {
                        mode: SoftDelete.active
                    }
                ],
                order: {
                    date: query.order ?? 'ASC',
                    created: query.order ?? 'DESC'
                },
                skip: +query.offset,
                take: +query.take,
                cache: 60000
            });

            if (isDefined(result)) {
                exception = await responseRequest({
                    status: 'foundQuery',
                    data: result,
                    params: result.length
                });
                // Set Meta Pagination information
                exception[0].response.meta = {
                    itemCount: total,
                    totalItems: total,
                    itemsPerPage: +query.take,
                    totalPages: Math.floor(total / +query.take),
                    currentPage: (+query.offset + 1),
                };
                
            }

        } catch (error) {
            if (error.code === '22P02') {
                exception = await responseRequest({
                    status: 'errorFound',
                    data: result,
                    params: error.message
                });
            } else {
                exception = await responseRequest({
                    status: 'errorOtherRequest',
                    data: error,
                    params: `Erreur de paramètre ${JSON.stringify(query)}`
                });
            }
        }
        throw new HttpException(exception[0], exception[1]);

    }

    async findPaginateResearch(payload: any, query: any): Promise<BalayureEntity[]>{
        let exception: any, result: any, total: number;
        try {
            [result, total] = await this.entityRepository
                                .createQueryBuilder("balayure")
                                .leftJoinAndSelect("balayure.lots", "lot", "lot.id = balayure.lot_id")
                                .leftJoinAndSelect("balayure.entrepot", "entrepot")
                                .leftJoinAndSelect("balayure.campagne", "campagne")
                                .where('LOWER(CONCAT(lot.numero_lot," ",lot.numero_ticket_pese," ",balayure.nbre_sacs," ",balayure.date)) ILIKE :query', {query: `%${query.query}%`})
                                .orWhere('balayure.lot_id IS NULL')
                                .orWhere('balayure.lot_id IS NOT NULL')
                                .andWhere('balance.mode = :mode', {mode: SoftDelete.active})
                                .orderBy('balayure.date', query.order ?? 'DESC')
                                .addOrderBy('balayure.created', 'DESC')
                                .skip(+query.offset)
                                .take(+query.take)
                                .cache(60000)
                                .getManyAndCount();

            if (isDefined(result)) {
                exception = await responseRequest({
                    status: 'foundQuery',
                    data: result,
                    params: result.length
                });
                // Set Meta Pagination information
                exception[0].response.meta = {
                    itemCount: total,
                    totalItems: total,
                    itemsPerPage: +query.take,
                    totalPages: Math.floor(total / +query.take),
                    currentPage: (+query.offset + 1),
                };                
            }

        } catch (error) {
            if (error.code === '22P02') {
                exception = await responseRequest({
                    status: 'errorFound',
                    data: result,
                    params: error.message
                });
            } else {
                exception = await responseRequest({
                    status: 'errorOtherRequest',
                    data: error,
                    params: `Erreur de paramètre ${JSON.stringify(query)}`
                });
            }
        }
        throw new HttpException(exception[0], exception[1]);

    }

    async findMode(payload: any, mode: SoftDelete): Promise<BalayureEntity[]> {
        let exception: any, result: any;

        try {
            result = await this.entityRepository.find({ mode: mode });

            if (isDefined(result)) {
                exception = await responseRequest({
                    status: 'found',
                    data: result,
                    params: null
                });
            }
        } catch (error) {
            if (error.code === '22P02') {
                exception = await responseRequest({
                    status: 'errorFound',
                    data: result,
                    params: error.message
                });
            } else {
                exception = await responseRequest({
                    status: 'errorOtherRequest',
                    data: error,
                    params: `Erreur de paramètre ${mode}`
                });
            }
        }
        throw new HttpException(exception[0], exception[1]);

    }

    async findById(payload: any, primaryKey: string): Promise<BalayureEntity> {
        let exception: any, result: any;

        try {
            result = await this.entityRepository.findOne({ id: primaryKey });

            if (isDefined(result)) {
                exception = await responseRequest({
                    status: 'foundQuery',
                    data: result,
                    params: 1
                });
            } else {
                exception = await responseRequest({
                    status: 'errorFound',
                    data: result,
                    params: `Aucun ID ${primaryKey} n'existe dans la base`
                });
            }

        } catch (error) {

            if (error.code === '22P02') {
                exception = await responseRequest({
                    status: 'errorFound',
                    data: result,
                    params: error.message
                });
            } else {
                exception = await responseRequest({
                    status: 'errorOtherRequest',
                    data: error,
                    params: `Erreur de paramètre ${primaryKey}`
                });
            }
        }
        throw new HttpException(exception[0], exception[1]);
    }

    async checkById(primaryKey: string): Promise<any> {
        let exception: any, result: any;

        try {
            result = await this.entityRepository.findOne({ id: primaryKey });
            if (isDefined(result)) {
                exception = {
                    status: 202,
                    data: result,
                    params: null
                };

                return exception;
            }
        } catch (error) {
            
            if (error.code === '22P02') {
                exception = await responseRequest({
                    status: 'errorFound',
                    data: result,
                    params: error.message
                });
            } else {
                exception = await responseRequest({
                    status: 'errorOtherRequest',
                    data: error,
                    params: error.message //`Erreur de paramètre ${primaryKey}`
                });
            }
            throw new HttpException(exception[0], exception[1]);
        }
    }

}
