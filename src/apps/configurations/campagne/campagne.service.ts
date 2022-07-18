import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmHttpParamQuery } from 'src/helpers/core/typeorm-query';
import { isDefined } from 'class-validator';
import { responseRequest } from 'src/helpers/core/response-request';
import { ILike, Raw, Repository } from 'typeorm';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { CampagneEntity } from './campagne.entity';
import { CampagneModel } from './campagne.model';
import { CampagneDto } from './campagne.dto';
import { CampagneSpecRepository } from '../campagne-spec/campagne-spec.repository';
import { CampagneSpecDto } from '../campagne-spec/campagne-spec.dto';
import { CampagneOutturnEntity } from './outturn/outturn.entity';
import { CampagneOutturnRepository } from './outturn/outturn.repository';
@Injectable()
export class CampagneService {
    constructor(
        //  Ci apres S'utilise avec un fichier repository. Mais ne peut plus creer de methode save update...
        // @InjectRepository(ProfilRepository) private accountRepository: ProfilRepository, 
        // Ci apres S'utilise sans fichier repository
        @InjectRepository(CampagneEntity) private readonly entityRepository: Repository<CampagneEntity>,
        @InjectRepository(CampagneSpecRepository) private readonly subRepository: CampagneSpecRepository,
        @InjectRepository(CampagneOutturnRepository) private readonly sub2Repository: CampagneOutturnRepository
    ) { }

    async save(payload: any, input: CampagneModel): Promise<CampagneEntity> {
        let result: any, exception: any;
        let detailsSpec = input.details; // recuperer les informations soumies en post
        let outturn = input.outturn; // recuperer les informations soumies en post
        try {
            result = await this.entityRepository.save(input as CampagneDto);
            if (isDefined(result)) {
                // Appeler la fonction d'insertion  
                if(detailsSpec.length > 0){
                    detailsSpec.forEach(async (item, index) => {
                        item.campagne_id = result.id;
                        item.created = new Date(Date.now());
                        item.created_by = `${payload.user.nom} ${payload.user.prenoms}`;
                        await this.subRepository.createDetail(item as CampagneSpecDto);
                    }); 
                }

                // Appeler la fonction d'insertion  
                if(outturn.length > 0){
                    outturn.forEach(async (item, index) => {
                        item.campagne_id = result.id;
                        item.created = new Date(Date.now());
                        item.created_by = `${payload.user.nom} ${payload.user.prenoms}`;
                        await this.sub2Repository.createDetail(item);
                    });   
                }    
        
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

    async update(payload: any, input: CampagneModel, primaryKey: string): Promise<CampagneEntity> {
        let exception: any, result: any;
        const response = await this.checkById(primaryKey);
        try{
            if (!isDefined(response)) {
                exception = await responseRequest({
                    status: 'errorFound',
                    data: response,
                    params: `Aucun element ne correspont au paramètre ${primaryKey}`
                });
                throw new HttpException(exception[0], exception[1]);
            }
                
            response.data.updated = new Date(Date.now());            
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

    async updateDetails(payload: any, input: any, primaryKey: string): Promise<CampagneOutturnEntity>{
        let exception: any, result: any;
        const response = await this.subRepository.findOne({id: primaryKey});

        if (!isDefined(response)) {
            exception = await responseRequest({
                status: 'errorFound',
                data: response,
                params: `Aucun element ne correspont au paramètre ${primaryKey}`
            });
            throw new HttpException(exception[0], exception[1]);

        }

        try {
            input.updated = new Date(Date.now());
            input.updated_by = `${payload.user.nom} ${payload.user.prenoms}`;
            result = await this.subRepository.save({ ...response, ...input });

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

    async updateMode(payload: any, primaryKey: string, mode: SoftDelete): Promise<CampagneEntity> {
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
                await this.sub2Repository.delete({campagne_id: primaryKey});

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

    async deleteDetails(payload: any, primaryKey: string): Promise<CampagneOutturnEntity>{
        let exception: any, result: any;
        const response = await this.sub2Repository.findOne({id: primaryKey});

        if (!isDefined(response)) {
            exception = await responseRequest({
                status: 'errorFound',
                data: response,
                params: `Aucun element ne correspont au paramètre ${primaryKey}`
            });
            throw new HttpException(exception[0], exception[1]);

        }

        try {
            result = await this.sub2Repository.deleteDetail(payload, primaryKey);

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

    async find(payload: any, query: object): Promise<CampagneEntity[]> {
        let exception: any, result: any;

        try {
            query = Object.keys(query).length > 0 ? TypeOrmHttpParamQuery(query) : {
                relations: ['speculation', 'detailsCampagne', 'outturn'], 
                where: [{mode: SoftDelete.active}], 
                order: {libelle: 'ASC', created: 'DESC'
            }
            };
            result = await this.entityRepository.find(query);
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

    async findPaginate(payload: any, query: any): Promise<CampagneEntity[]>{
        let exception: any, result: any, total: number;
        try {

            [result, total] = await this.entityRepository.findAndCount({
                relations: ['speculation', 'detailsCampagne', 'outturn'],
                where: [
                    {
                        mode: SoftDelete.active
                    }
                ],
                order: {
                    libelle: query.order ?? 'ASC',
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
    
    async findPaginateResearch(payload: any, query: any): Promise<CampagneEntity[]>{
        let exception: any, result: any, total: number;
        try {
            [result, total] = await this.entityRepository.findAndCount({
                relations: ['speculation', 'detailsCampagne', 'outturn'],
                where:[
                    {
                        libelle: ILike(`%${query.query}%`),
                        mode: SoftDelete.active
                    },
                    {
                        prix_bord: Raw((columnAlias) => `CAST(${columnAlias} AS TEXT) ILIKE :value`, { value: `%${query.query}%`}),
                        mode: SoftDelete.active
                    },
                    {
                        ouverture: Raw((columnAlias) => `TO_CHAR(${columnAlias}, 'YYYY-MM-DD HH:MI:SS') ILIKE :value`, { value: `%${query.query}%`}),
                        mode: SoftDelete.active
                    },
                    {
                        fermeture: Raw((columnAlias) => `TO_CHAR(${columnAlias}, 'YYYY-MM-DD HH:MI:SS') ILIKE :value`, { value: `%${query.query}%`}),
                        mode: SoftDelete.active
                    }
                ],
                order: { 
                    libelle: query.order ?? 'ASC',
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

    async findMode(payload: any, mode: SoftDelete): Promise<CampagneEntity[]> {
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

    async findById(payload: any, primaryKey: string): Promise<CampagneEntity> {
        let exception: any, result: any;

        try {
            result = await this.entityRepository.findOne({ id: primaryKey, mode: SoftDelete.active  });

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
