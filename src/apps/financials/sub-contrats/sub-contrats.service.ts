import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isDefined } from 'class-validator';
import { responseRequest } from 'src/helpers/core/response-request';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { TypeOrmHttpParamQuery } from 'src/helpers/core/typeorm-query';
import { unlinkSync } from 'fs';
import { SubContratsEntity } from './sub-contrats.entity';
import { SubFileContratsEntity } from './sub-files-contrats/sub-file-contrat.entity';
import { SubContratsModel } from './sub-contrats.model';
import { SubFileContratsModel } from './sub-files-contrats/sub-file-contrat.model';
import { convertBase64 } from 'src/helpers/utils/convertBase64';

@Injectable()
export class SubContratsService {

    constructor(
        @InjectRepository(SubContratsEntity) private readonly entityRepository: Repository<SubContratsEntity>,
        @InjectRepository(SubFileContratsEntity) private readonly subRepository: Repository<SubFileContratsEntity>,
    ) { }

    async save(payload: any, input: SubContratsModel): Promise<SubContratsEntity> {
        let result: any, exception: any;
        try {
            result = await this.entityRepository.save(input);
            if (isDefined(result)) {
                // Save Sous contrat
                setImmediate(async () => {
                    const file: SubFileContratsModel | any = await convertBase64(input.contrat, 'Sous Contrat', './uploads/sub-contrats/');
                    if(typeof file == 'object') {
                        file.sub_contrat_id = result.id;
                        file.created_by = `${payload.user.nom} ${payload.user.prenoms}`;
                        await this.subRepository.save(file);
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

    async update(payload: any, input: object, primaryKey: string): Promise<SubContratsEntity> {
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

    async updateMode(payload: any, primaryKey: string, mode: SoftDelete): Promise<SubContratsEntity> {
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

    async updateFile(payload: any, input: any, primaryKey: string): Promise<SubFileContratsEntity>{
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

            response.updated_by = `${payload.user.nom} ${payload.user.prenoms}`;
            response.updated = new Date(Date.now());
            const path = response.path;
            setImmediate(async () => {
                const file: SubFileContratsModel | any = await convertBase64(input, 'Sous Contrat', './uploads/sub-contrats/');
                if(typeof file == 'object') {
                    // delete origin file
                    unlinkSync(path);
                    // Save
                    await this.subRepository.save({...response, ...file});
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
                let query;
                // Delete Lettre 
                query = await this.subRepository.findOne({sub_contrat_id: primaryKey});
                    if(isDefined(query)){
                        await this.subRepository.delete({sub_contrat_id: primaryKey});
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

    async find(payload: any, query: object): Promise<SubContratsEntity[]> {
        let exception: any, result: any;

        try {
            const queryFiltering = Object.keys(query).length > 0 ? TypeOrmHttpParamQuery(query) : {
                relations: ['contrat', 'client', 'incotem', 'file'],
                where: [{mode: SoftDelete.active}]
            };
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

    async findMode(payload: any, mode: SoftDelete): Promise<SubContratsEntity[]> {
        let exception: any, result: any;

        try {
            result = await this.entityRepository.find({
                relations: ['contrat', 'client', 'incotem', 'file'],
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

    async findById(payload: any, primaryKey: string): Promise<SubContratsEntity> {
        let exception: any, result: any;

        try {
            result = await this.entityRepository.findOne({
                relations: ['contrat', 'client', 'incotem', 'file'],
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
