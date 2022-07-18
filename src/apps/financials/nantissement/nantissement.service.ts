import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Raw, Repository } from 'typeorm';
import { isDefined } from 'class-validator';
import { responseRequest } from 'src/helpers/core/response-request';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { TypeOrmHttpParamQuery } from 'src/helpers/core/typeorm-query';
import { NantissementEntity } from './nantissement.entity';
import { NantissementModel } from './nantissement.model';
import { LotsNantisRepository } from './lots-nantis/lots-nantis.repository';
import { LotsNantisDto } from './lots-nantis/lots-nantis.dto';
import { LotsNantisEntity } from './lots-nantis/lots-nantis.entity';
import { LettreDetentionEntity } from './files-nantissement/lettre-detention/lettre-detention.entity';
import { LettreDetentionModel } from './files-nantissement/lettre-detention/lettre-detention.model';
import { AutorisationSortieEntity } from './files-nantissement/autorisation-sortie/autorisation-sortie.entity';
import { AutorisationSortieModel } from './files-nantissement/autorisation-sortie/autorisation-sortie.model';
import { StateLots } from 'src/helpers/enums/state.enum';
import { unlinkSync } from 'fs';
import { convertBase64 } from 'src/helpers/utils/convertBase64';

@Injectable()
export class NantissementService {

    constructor(
        @InjectRepository(NantissementEntity) private readonly entityRepository: Repository<NantissementEntity>,
        @InjectRepository(LotsNantisRepository) private readonly subRepository: LotsNantisRepository,
        @InjectRepository(LettreDetentionEntity) private readonly sub2Repository: Repository<LettreDetentionEntity>,
        @InjectRepository(AutorisationSortieEntity) private readonly sub3Repository: Repository<AutorisationSortieEntity>,
    ) { }

    async save(payload:any, input: NantissementModel): Promise<NantissementEntity> {
        let result: any, exception: any;
        try {
            result = await this.entityRepository.save(input);
            if (isDefined(result)) {
                // Lots Nantis
                input.lots.forEach(async (item, index) => {
                    item.nantissement_id = result.id;
                    item.created_by = `${payload.user.nom} ${payload.user.prenoms}`;
                    await this.subRepository.createDetail(item as LotsNantisDto);
                });
                // Lettre de tiers detentions
                setImmediate(async () => {
                    const file: LettreDetentionModel | any = await convertBase64(input.lettre, 'Lettre de Detention', './uploads/lettre-tiers-detention/');
                    if(typeof file == 'object') {
                        file.nantissement_id = result.id;
                        file.created_by = `${payload.user.nom} ${payload.user.prenoms}`;
                        await this.sub2Repository.save(file);
                    }    
                });

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

    async update(payload:any, input: object, primaryKey: string): Promise<NantissementEntity> {
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

    async updateMode(payload:any, primaryKey: string, mode: SoftDelete): Promise<NantissementEntity> {
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

    async updateLots(payload:any, input: any, primaryKey: string): Promise<LotsNantisEntity>{
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

    async updateLettre(payload:any, input: any, primaryKey: string): Promise<LettreDetentionEntity>{
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
            response.updated_by = `${payload.user.nom} ${payload.user.prenoms}`;
            response.updated = new Date(Date.now());
            const path = response.path;
            // Save infos of lettre detention
            setImmediate(async () => {
                    const file: LettreDetentionModel | any = await convertBase64(input, 'Lettre de Detention', './uploads/lettre-tiers-detention/');
                    if(typeof file == 'object') {
                        // delete origin file
                        unlinkSync(path);
                        // Save
                        await this.sub2Repository.save({...response, ...file});
                    }    
                });

                exception = await responseRequest({
                    status: 'updated',
                    data: null,
                    params: null
                });

        } catch (error) {
            exception = await responseRequest({
                status: 'errorUpdated',
                data: null,
                params: error
            });
        }

        throw new HttpException(exception[0], exception[1]);
    }

    async relache(payload:any, input: any, primaryKey: string) : Promise<AutorisationSortieEntity>{
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
            response.data.statut = StateLots.relacher;
            response.data.updated = new Date(Date.now());
            response.data.updated_by = `${payload.user.nom} ${payload.user.prenoms}`;
            result = await this.entityRepository.save(response.data);

            if (isDefined(result)) {
                // Save file logo
                setImmediate(async () => {
                    const file: AutorisationSortieModel | any = await convertBase64(input, 'Autorisation Sorite Lots', './uploads/autorisation-sortie/');
                    if(typeof file == 'object') {
                        file.nantissement_id = primaryKey;
                        file.created_by = `${payload.user.nom} ${payload.user.prenoms}`;
                        await this.sub3Repository.save(file);
                    }    
                });

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

    async updateAutorisation(payload:any, input: any, primaryKey: string): Promise<AutorisationSortieEntity>{
        let exception: any, result: any;
        const response = await this.sub3Repository.findOne({id: primaryKey});

        if (!isDefined(response)) {
            exception = await responseRequest({
                status: 'errorFound',
                data: response,
                params: `Aucun element ne correspont au paramètre ${primaryKey}`
            });
            throw new HttpException(exception[0], exception[1]);

        }

        try {
            response.updated_by = `${payload.user.nom} ${payload.user.prenoms}`;
            response.updated = new Date(Date.now());
            const path = response.path;
            // Save Autorisation
            setImmediate(async () => {
                const file: AutorisationSortieModel | any = await convertBase64(input, 'Autorisation Sortie Lots', './uploads/autorisation-sortie/');
                if(typeof file == 'object') {
                    // delete origin file
                    unlinkSync(path);
                    // Save
                    await this.sub3Repository.save({...response, ...file});
                }    
            });
                exception = await responseRequest({
                    status: 'updated',
                    data: null,
                    params: null
                });

        } catch (error) {
            exception = await responseRequest({
                status: 'errorUpdated',
                data: null,
                params: error
            });
        }

        throw new HttpException(exception[0], exception[1]);
    }

    async deleteLots(payload:any, primaryKey: string): Promise<LotsNantisEntity>{
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
            //result = await this.subRepository.delete(primaryKey);
            result = await this.subRepository.deleteDetail(payload, primaryKey);

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

    async delete(payload:any, primaryKey: string): Promise<void> {
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
                await this.subRepository.delete({nantissement_id: primaryKey});
                let query;
                // Delete Lettre 
                query = await this.sub2Repository.findOne({nantissement_id: primaryKey});
                    if(isDefined(query)){
                        await this.sub2Repository.delete({nantissement_id: primaryKey});
                        // delete origin file
                        unlinkSync(query.path);
                    }
                // Delete Autorisation
                query = await this.sub2Repository.findOne({nantissement_id: primaryKey});
                if(isDefined(query)){
                    await this.sub3Repository.delete({nantissement_id: primaryKey});
                    // delete origin file
                    unlinkSync(query.path);
                }

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

    async softDelete(payload:any, primaryKey: string): Promise<void> {
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

    async find(payload:any, query: object): Promise<NantissementEntity[]> {
        let exception: any, result: any;

        try {
            const queryFiltering = Object.keys(query).length > 0 ? TypeOrmHttpParamQuery(query) : {
                relations: ['banque', 'tierDetenteur', 'lotsNantis', 'lettre', 'autorisation', 'denantissement', 'campagne'],
                where: [{mode: SoftDelete.active}]
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

    async listDenantissement(payload: any): Promise<NantissementEntity[]>{
        let exception: any, result: any;
        try {
            result = await this.entityRepository
                                .createQueryBuilder("nantis")
                                .leftJoin("admin_denantissement", "denantis", "nantis.id = denantis.nantissement_id")
                                .where("denantis.nantissement_id IS NULL")
                                .andWhere("nantis.mode = :mode",{mode : SoftDelete.active})
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

    async findPaginate(payload: any, query: any): Promise<NantissementEntity[]>{
        let exception: any, result: any, total: number;
        try {
            [result, total] = await this.entityRepository.findAndCount({
                relations: ['banque', 'tierDetenteur', 'lotsNantis', 'lettre', 'autorisation', 'denantissement', 'campagne'],
                where: [
                    {
                        mode: SoftDelete.active
                    }
                ],
                order: {
                    numero_lettre: query.order ?? 'ASC',
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

    async findPaginateResearch(payload: any, query: any): Promise<NantissementEntity[]>{
        let exception: any, result: any, total: number;
        try {
            [result, total] = await this.entityRepository.findAndCount({
                                    relations: ['banque', 'tierDetenteur', 'lotsNantis', 'lettre', 'autorisation', 'denantissement', 'campagne'],
                                    where:[
                                        {
                                            numero_lettre: ILike(`%${query.query}%`),
                                            mode: SoftDelete.active
                                        },
                                        {
                                            montant: Raw((columnAlias) => `CAST(${columnAlias} AS TEXT) ILIKE :value`, { value: `%${query.query}%`}),
                                            mode: SoftDelete.active
                                        },
                                        {
                                            date_nantissement: Raw((columnAlias) => `TO_CHAR(${columnAlias}, 'YYYY-MM-DD HH:MI:SS') ILIKE :value`, { value: `%${query.query}%`}),
                                            mode: SoftDelete.active
                                        }
                                    ],
                                    order: { 
                                        numero_lettre: query.order ?? 'ASC',
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

    async findMode(payload:any, mode: SoftDelete): Promise<NantissementEntity[]> {
        let exception: any, result: any;

        try {
            result = await this.entityRepository.find({ 
                relations: ['banque', 'tierDetenteur', 'lotsNantis', 'lettre', 'autorisation', 'denantissement', 'campagne'],
                where: [{mode: mode}]
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

    async findById(payload:any, primaryKey: string): Promise<NantissementEntity> {
        let exception: any, result: any;

        try {
            result = await this.entityRepository.findOne({ 
                relations: ['banque', 'tierDetenteur', 'lotsNantis', 'lettre', 'autorisation', 'denantissement', 'campagne'],
                where: [{id: primaryKey, mode: SoftDelete.active}]
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
