
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isDefined } from 'class-validator';
import { responseRequest } from 'src/helpers/core/response-request';
import { TypeOrmHttpParamQuery } from 'src/helpers/core/typeorm-query';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { ILike, Raw, Repository } from 'typeorm';
import { ConteneurEntity } from './conteneur.entity';
import { ConteneurModel } from './conteneur.model';

@Injectable()
export class ConteneursService {

    constructor(
        @InjectRepository(ConteneurEntity) private readonly entityRepository: Repository<ConteneurEntity>,
    ) { }

    async save(payload: any, input: ConteneurModel): Promise<ConteneurEntity> {
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

    async update(payload: any, input: object, primaryKey: string): Promise<ConteneurEntity> {
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

    async updateMode(payload: any, primaryKey: string, mode: SoftDelete): Promise<ConteneurEntity> {
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

    async find(payload: any, query: object): Promise<ConteneurEntity[]> {
        let exception: any, result: any;

        try {
            const queryFiltering = Object.keys(query).length > 0 ? TypeOrmHttpParamQuery(query) : {
                relations: ['booking', 'plomb'],
                where: [{superviseur_id: payload.user.id, mode: SoftDelete.active}]
            }
            result = await this.entityRepository.find(queryFiltering);
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

    async findPaginate(payload: any, query: any): Promise<ConteneurEntity[]>{
        let exception: any, result: any, total: number;
        try {
            [result, total] = await this.entityRepository.findAndCount({
                relations: ['booking', 'plomb'],
                where: [
                    {
                        superviseur_id: payload.user.id,
                        mode: SoftDelete.active
                    }
                ],
                order: {
                    numero: query.order ?? 'ASC',
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

    async findPaginateResearch(payload: any, query: any): Promise<ConteneurEntity[]>{
        let exception: any, result: any, total: number;
        try {
            [result, total] = await this.entityRepository.findAndCount({
                                    relations: ['booking', 'plomb'],
                                    where:[
                                        {
                                            numero: ILike(`%${query.query}%`),
                                            mode: SoftDelete.active
                                        },
                                        {
                                            capacite: Raw((columnAlias) => `CAST(${columnAlias} AS TEXT) ILIKE :value`, { value: `%${query.query}%`}),
                                            mode: SoftDelete.active
                                        },
                                        {
                                            type_tc: ILike(`%${query.query}%`),
                                            mode: SoftDelete.active
                                        }
                                    ],
                                    order: { 
                                        //numero: query.order ?? 'ASC',
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

    async listNonEmpotage(payload: any): Promise<ConteneurEntity[]>{
        let exception: any, result: any;
        try {
            result = await this.entityRepository
                                .createQueryBuilder("conteneur")
                                .leftJoin("admin_empotage", "empotage", "conteneur.id = empotage.conteneur_id")
                                .where("empotage.conteneur_id IS NULL")
                                .andWhere("conteneur.superviseur_id = :user::uuid", {user: payload.user.id})
                                .andWhere("conteneur.mode = :mode",{mode : SoftDelete.active})
                                .getMany();

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
                    params: `Erreur de paramètre`
                });
            }
        }
        throw new HttpException(exception[0], exception[1]);

    }

    async listNonBL(payload: any): Promise<ConteneurEntity[]>{
        let exception: any, result: any;
        try {
            result = await this.entityRepository
                                .createQueryBuilder("conteneur")
                                .leftJoinAndSelect("conteneur.plomb", "plomb", "conteneur.id = plomb.conteneur_id")
                                .leftJoin("admin_detail_bl", "details", "conteneur.id = details.conteneur_id")
                                .where("details.conteneur_id IS NULL")
                                //.andWhere("conteneur.superviseur_id = :user::uuid", {user: payload.user.id})
                                .andWhere("conteneur.mode = :mode",{mode : SoftDelete.active})
                                .getMany();

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
                    params: `Erreur de paramètre`
                });
            }
        }
        throw new HttpException(exception[0], exception[1]);

    }

    async listNonPlomb(payload: any): Promise<ConteneurEntity[]>{
        let exception: any, result: any;
        try {
            result = await this.entityRepository
                                .createQueryBuilder("conteneur")
                                .leftJoin("admin_plomb_conteneur", "plomb", "conteneur.id = plomb.conteneur_id")
                                .where("plomb.conteneur_id IS NULL")
                                .andWhere("conteneur.superviseur_id = :user::uuid", {user: payload.user.id})
                                .andWhere("conteneur.mode = :mode",{mode : SoftDelete.active})
                                .getMany();

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
                    params: `Erreur de paramètre`
                });
            }
        }
        throw new HttpException(exception[0], exception[1]);

    }

    async listNonTicketRelevage(payload: any): Promise<ConteneurEntity[]>{
        let exception: any, result: any;
        try {
            result = await this.entityRepository
                                .createQueryBuilder("conteneur")
                                .leftJoin("admin_ticket_relevage", "ticket", "conteneur.id = ticket.conteneur_id")
                                .where("ticket.conteneur_id IS NULL")
                                .andWhere("conteneur.superviseur_id = :user::uuid", {user: payload.user.id})
                                .andWhere("conteneur.mode = :mode",{mode : SoftDelete.active})
                                .getMany();

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
                    params: `Erreur de paramètre`
                });
            }
        }
        throw new HttpException(exception[0], exception[1]);

    }

    async findMode(payload: any, mode: SoftDelete): Promise<ConteneurEntity[]> {
        let exception: any, result: any;

        try {
            result = await this.entityRepository.find({
                                relations: ['booking', 'plomb'],
                                where: [{superviseur_id: payload.user.id, mode: mode}]
                                });

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

    async findById(payload: any, primaryKey: string): Promise<ConteneurEntity> {
        let exception: any, result: any;

        try {
            result = await this.entityRepository.findOne({
                                relations: ['booking', 'plomb'],
                                where: [{id: primaryKey, superviseur_id: payload.user.id}]
                                });

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
