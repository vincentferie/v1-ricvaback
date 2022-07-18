import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DetailsSpeculationEntity } from './detail-speculation.entity';
import { ILike, Raw, Repository } from 'typeorm';
import { DetailsSpeculationModel } from './detail-speculation.model';
import { isDefined } from 'class-validator';
import { responseRequest } from 'src/helpers/core/response-request';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { TypeOrmHttpParamQuery } from 'src/helpers/core/typeorm-query';
import { detailsSpeculationSeed } from 'src/seeders/fakers';

@Injectable()
export class DetailsSpeculationService {

    constructor(
        @InjectRepository(DetailsSpeculationEntity) private readonly detailSpeculationRepository: Repository<DetailsSpeculationEntity>,
    ) { }

    async save(payload: any, input: DetailsSpeculationModel): Promise<DetailsSpeculationEntity> {
        let result: any, exception: any;
        try {
            result = await this.detailSpeculationRepository.save(input);
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

    async update(payload: any, input: object, primaryKey: string): Promise<DetailsSpeculationEntity> {
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
            response.data.updated = new Date(Date.now());
            result = await this.detailSpeculationRepository.save({ ...response.data, ...input });

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

    async updateMode(payload: any, primaryKey: string, mode: SoftDelete): Promise<DetailsSpeculationEntity> {
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
            response.data.updated_by = `${payload.user.nom} ${payload.user.prenoms}`;;
            result = await this.detailSpeculationRepository.save(response.data);

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
            result = await this.detailSpeculationRepository.delete(primaryKey);

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
            response.data.updated_by = `${payload.user.nom} ${payload.user.prenoms}`;;
            result = await this.detailSpeculationRepository.save(response.data);

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

    async find(payload:any, query: object): Promise<DetailsSpeculationEntity[]> {
        let exception: any, result: any;

        try {
            const queryFiltering = Object.keys(query).length > 0 ? TypeOrmHttpParamQuery(query) : {
                relations: ['speculation'],
                where: [{mode: SoftDelete.active}]
            }
            result = await this.detailSpeculationRepository.find(queryFiltering);
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

    async findPaginate(payload: any, query: any): Promise<DetailsSpeculationEntity[]>{
        let exception: any, result: any, total: number;
        try {
            [result, total] = await this.detailSpeculationRepository.findAndCount({
                relations: ['speculation'],
                where: [
                    {
                        mode: SoftDelete.active
                    }
                ],
                order: {
                    poids_sac: query.order ?? 'DESC',
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

    async findPaginateResearch(payload: any, query: any): Promise<DetailsSpeculationEntity[]>{
        let exception: any, result: any, total: number;
        try {        
            [result, total] = await this.detailSpeculationRepository.findAndCount({
                                    relations: ['speculation'],
                                    where: [
                                        {
                                            poids_sac: Raw((columnAlias) => `CAST(${columnAlias} AS TEXT) ILIKE :value`, { value: `%${query.query}%`}),
                                            mode: SoftDelete.active
                                        },
                                        {
                                            nbr_sac: Raw((columnAlias) => `CAST(${columnAlias} AS TEXT) ILIKE :value`, { value: `%${query.query}%`}),
                                            mode: SoftDelete.active
                                        },
                                        {
                                            unite: ILike(`%${query.query}%`),
                                            mode: SoftDelete.active
                                        },
                                    ],
                                    order: { 
                                        poids_sac: query.order ?? 'DESC',
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

    async findMode(payload: any, mode: SoftDelete): Promise<DetailsSpeculationEntity[]> {
        let exception: any, result: any;

        try {
            result = await this.detailSpeculationRepository.find({relations: ['speculation'], where: [{ mode: mode }]});

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

    async findById(payload: any, primaryKey: string): Promise<DetailsSpeculationEntity> {
        let exception: any, result: any;

        try {
            result = await this.detailSpeculationRepository.findOne({ relations: ['speculation'], where: [{id: primaryKey, mode: SoftDelete.active }]});

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
            result = await this.detailSpeculationRepository.findOne({ relations: ['speculation'], where: [{id: primaryKey, mode: SoftDelete.active}] });
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

    /**
    * Seed .
    *
    * @function
    */
    create(): Array<Promise<DetailsSpeculationEntity>> {
        return detailsSpeculationSeed.map(async (item: DetailsSpeculationModel) => {
            return await this.detailSpeculationRepository
                .findOne({ speculation_id: item.speculation_id })
                .then(async dbresult => {
                    // We check if a item already exists.
                    // If it does don't create a new one.
                    if (isDefined(dbresult)) {
                        return Promise.resolve(null);
                    }
                    return await this.detailSpeculationRepository.save(item);
                })
                .catch(error => Promise.reject(error));
        });
    }
}
