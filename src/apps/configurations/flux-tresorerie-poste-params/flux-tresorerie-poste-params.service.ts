import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmHttpParamQuery } from 'src/helpers/core/typeorm-query';
import { isDefined } from 'class-validator';
import { responseRequest } from 'src/helpers/core/response-request';
import { Repository } from 'typeorm';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { FluxTresoreriePosteParamsEntity } from './flux-tresorerie-poste-params.entity';
import { FluxTresoreriePosteParamsDto } from './flux-tresorerie-poste-params.dto';
import { FluxTresoreriePosteParamsModel } from './flux-tresorerie-poste-params.model';
import { fluxTresorerieCompteSeed } from 'src/seeders/fakers';

@Injectable()
export class FluxTresoreriePosteParamsService {

    constructor(
        //  Ci apres S'utilise avec un fichier repository. Mais ne peut plus creer de methode save update...
        // @InjectRepository(ProfilRepository) private accountRepository: ProfilRepository, 
        // Ci apres S'utilise sans fichier repository
        @InjectRepository(FluxTresoreriePosteParamsEntity) private readonly fluxRepository: Repository<FluxTresoreriePosteParamsEntity>,
    ) { }

    async save(payload: any, input: FluxTresoreriePosteParamsModel): Promise<FluxTresoreriePosteParamsEntity> {
        let result: any, exception: any;
        try {
            result = await this.fluxRepository.save(input as FluxTresoreriePosteParamsDto);
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

    async update(payload: any, input: FluxTresoreriePosteParamsModel, primaryKey: string): Promise<FluxTresoreriePosteParamsEntity> {
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
            result = await this.fluxRepository.save({ ...response.data, ...input });

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

    async updateMode(payload: any, primaryKey: string, mode: SoftDelete): Promise<FluxTresoreriePosteParamsEntity> {
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
            result = await this.fluxRepository.save(response.data);

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
            result = await this.fluxRepository.delete(primaryKey);

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
            result = await this.fluxRepository.save(response.data);

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

    async find(payload: any, query: object): Promise<FluxTresoreriePosteParamsEntity[]> {
        let exception: any, result: any;

        try {
            const queryFiltering = Object.keys(query).length > 0 ? TypeOrmHttpParamQuery(query) : {
                mode: SoftDelete.active
            }
            result = await this.fluxRepository.find(queryFiltering);
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

    async findMode(payload: any, mode: SoftDelete): Promise<FluxTresoreriePosteParamsEntity[]> {
        let exception: any, result: any;

        try {
            result = await this.fluxRepository.find({ mode: mode });

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

    async findById(payload: any, primaryKey: string): Promise<FluxTresoreriePosteParamsEntity> {
        let exception: any, result: any;

        try {
            result = await this.fluxRepository.findOne({ id: primaryKey, mode: SoftDelete.active  });

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
            result = await this.fluxRepository.findOne({ id: primaryKey });
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
  create(): Array<Promise<FluxTresoreriePosteParamsEntity>> {
    return fluxTresorerieCompteSeed.map(async (item: FluxTresoreriePosteParamsModel) => {
        return await this.fluxRepository
            .findOne({ flux_tresorerie_params_id: item.flux_tresorerie_params_id, numero: item.numero })
            .then(async dbresult => {
                // We check if a item already exists.
                // If it does don't create a new one.
                if (isDefined(dbresult)) {
                    return Promise.resolve(null);
                }
                return await this.fluxRepository.save(item);
            })
            .catch(error => Promise.reject(error));
        });
    }


}
