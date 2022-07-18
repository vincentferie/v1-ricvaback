import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { isDefined } from 'class-validator';
import { responseRequest } from 'src/helpers/core/response-request';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { TypeOrmHttpParamQuery } from 'src/helpers/core/typeorm-query';
import { unlinkSync } from 'fs';
import { BonLivraisonEntity } from './bon-livraison.entity';
import { DetailsBonLivraisonRepository } from './details-bl/detail-bl.repository';
import { FileBlEntity } from './files-bl/file-bl.entity';
import { DetailBlDto } from './details-bl/detail-bl.dto';
import { BonLivraisonModel } from './bon-livraison.model';
import { FileBlModel } from './files-bl/file-bl.model';
import { DetailBlEntity } from './details-bl/detail-bl.entity';
import { convertBase64 } from 'src/helpers/utils/convertBase64';
import { DetailBlModel } from './details-bl/detail-bl.model';

@Injectable()
export class BonLivraisonService {

    constructor(
        @InjectRepository(BonLivraisonEntity) private readonly entityRepository: Repository<BonLivraisonEntity>,
        @InjectRepository(DetailsBonLivraisonRepository) private readonly subRepository: DetailsBonLivraisonRepository,
        @InjectRepository(FileBlEntity) private readonly sub2Repository: Repository<FileBlEntity>,
    ) { }

    async save(payload: any, input: BonLivraisonModel): Promise<BonLivraisonEntity> {
        let result: any, exception: any;
        try {
            result = await this.entityRepository.save(input);
            if (isDefined(result)) {
                // Save Bl
                input.details.forEach(async (item, index) => {
                    item.bon_livraison_id = result.id;
                    item.created_by = `${payload.user.nom} ${payload.user.prenoms}`;
                    await this.subRepository.createDetail(item);
                });

                // Save 
                setImmediate(async () => {
                    const file: FileBlModel | any = await convertBase64(input.file, 'Bill Of Lading', './uploads/bill-of-lading/');
                    if(typeof file == 'object') {
                        file.bon_livraison_id = result.id;
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

    async update(payload: any, input: object, primaryKey: string): Promise<BonLivraisonEntity> {
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
            response.data.updated_by = `${payload.user.nom} ${payload.user.prenoms}`;            
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

    async updateMode(payload: any, primaryKey: string, mode: SoftDelete): Promise<BonLivraisonEntity> {
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

    async updateDetails(payload: any, input: DetailBlModel[], primaryKey: string): Promise<DetailBlEntity>{
        let exception: any, result = [];
        const response = await this.subRepository.delete({bon_livraison_id: primaryKey});

        if (!isDefined(response)) {
            exception = await responseRequest({
                status: 'errorFound',
                data: response,
                params: `Aucun element ne correspont au paramètre ${primaryKey}`
            });
            throw new HttpException(exception[0], exception[1]);
        }

        try {
            for(const item of input){
                item.bon_livraison_id = primaryKey;
                item.created_by = `${payload.user.nom} ${payload.user.prenoms}`;
                item.created = new Date(Date.now());
                const resultConst = await this.subRepository.createDetail(item as DetailBlDto);
                result.push(resultConst);
            }

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

    async updateFile(payload: any, input: any, primaryKey: string): Promise<FileBlEntity>{
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

            setImmediate(async () => {
                const file: FileBlModel | any = await convertBase64(input, 'Bill Of Lading', './uploads/bill-of-lading/');
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

    async deleteDetails(payload: any, primaryKey: string): Promise<DetailBlEntity>{
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
                await this.subRepository.delete({bon_livraison_id: primaryKey});
                let query;
                // Delete Lettre 
                query = await this.sub2Repository.findOne({bon_livraison_id: primaryKey});
                    if(isDefined(query)){
                        await this.sub2Repository.delete({bon_livraison_id: primaryKey});
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

    async find(payload: any, query: object): Promise<BonLivraisonEntity[]> {
        let exception: any, result: any;

        try {
            query = Object.keys(query).length > 0 ? TypeOrmHttpParamQuery(query) : {
                relations: ['groupement', 'filesbl', 'details'], 
                where: [{mode: SoftDelete.active}], 
                order: {numero_bl: 'ASC', created: 'DESC'}};
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
  
    async findPaginate(payload: any, query: any): Promise<BonLivraisonEntity[]>{
        let exception: any, result: any, total: number;
        try {
            [result, total] = await this.entityRepository.findAndCount({
                relations: ['groupement', 'filesbl', 'details'],
                where: [
                    {
                        mode: SoftDelete.active
                    }
                ],
                order: {
                    numero_bl: query.order ?? 'ASC',
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

    async findPaginateResearch(payload: any, query: any): Promise<BonLivraisonEntity[]>{
        let exception: any, result: any, total: number;
        try {
            [result, total] = await this.entityRepository.findAndCount({
                                    relations: ['groupement', 'filesbl', 'details'],
                                    where:[
                                        {
                                            client: ILike(`%${query.query}%`),
                                            mode: SoftDelete.active
                                        },
                                        {
                                            destination: ILike(`%${query.query}%`),
                                            mode: SoftDelete.active
                                        },
                                        {
                                            provenance: ILike(`%${query.query}%`),
                                            mode: SoftDelete.active
                                        },
                                        {
                                            amateur: ILike(`%${query.query}%`),
                                            mode: SoftDelete.active
                                        },
                                        {
                                            nom_client: ILike(`%${query.query}%`),
                                            mode: SoftDelete.active
                                        },
                                        {
                                            numero_booking: ILike(`%${query.query}%`),
                                            mode: SoftDelete.active
                                        },
                                        {
                                            numero_bl: ILike(`%${query.query}%`),
                                            mode: SoftDelete.active
                                        },
                                        {
                                            numero_tc: ILike(`%${query.query}%`),
                                            mode: SoftDelete.active
                                        },
                                        {
                                            numero_plomb: ILike(`%${query.query}%`),
                                            mode: SoftDelete.active
                                        }
                                    ],
                                    order: { 
                                        numero_bl: query.order ?? 'ASC',
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

    async findMode(payload: any, mode: SoftDelete): Promise<BonLivraisonEntity[]> {
        let exception: any, result: any;

        try {
            result = await this.entityRepository.find({relations: ['groupement', 'filesbl', 'details'], where: [{mode: mode}] });

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

    async findById(payload: any, primaryKey: string): Promise<BonLivraisonEntity> {
        let exception: any, result: any;

        try {
            result = await this.entityRepository.findOne({ relations: ['groupement', 'filesbl', 'details'], where: [{id: primaryKey, mode: SoftDelete.active }] });

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
