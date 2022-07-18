
import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmHttpParamQuery } from 'src/helpers/core/typeorm-query';
import { isDefined } from 'class-validator';
import { responseRequest } from 'src/helpers/core/response-request';
import { Repository } from 'typeorm';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { BilanParamsEntity } from './bilan-params.entity';
import { BilanParamsModel } from './bilan-params.model';
import { BilanParamsDto } from './bilan-params.dto';
import { bilanParamsSeed } from 'src/seeders/fakers';

@Injectable()
export class BilanParamsService {

    constructor(
        //  Ci apres S'utilise avec un fichier repository. Mais ne peut plus creer de methode save update...
        // @InjectRepository(ProfilRepository) private accountRepository: ProfilRepository, 
        // Ci apres S'utilise sans fichier repository
        @InjectRepository(BilanParamsEntity) private readonly bilanRepository: Repository<BilanParamsEntity>,
    ) { }

    async save(payload: any, input: BilanParamsModel): Promise<BilanParamsEntity> {
        let result: any, exception: any;
        try {
            result = await this.bilanRepository.save(input as BilanParamsDto);
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

    async update(payload: any, input: BilanParamsModel, primaryKey: string): Promise<BilanParamsEntity> {
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
            result = await this.bilanRepository.save({ ...response.data, ...input });

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

    async updateMode(payload: any, primaryKey: string, mode: SoftDelete): Promise<BilanParamsEntity> {
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
            result = await this.bilanRepository.save(response.data);

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
            result = await this.bilanRepository.delete(primaryKey);

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
            result = await this.bilanRepository.save(response.data);

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

    async find(payload: any, query: object): Promise<BilanParamsEntity[]> {
        let exception: any, result: any;

        try {
            result = await this.bilanRepository.find(TypeOrmHttpParamQuery(query));
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

    async findMode(payload: any, mode: SoftDelete): Promise<BilanParamsEntity[]> {
        let exception: any, result: any;

        try {
            result = await this.bilanRepository.find({ mode: mode });

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

    async findById(payload: any, primaryKey: string): Promise<BilanParamsEntity> {
        let exception: any, result: any;

        try {
            result = await this.bilanRepository.findOne({ id: primaryKey, mode: SoftDelete.active  });

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
            result = await this.bilanRepository.findOne({ id: primaryKey });
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
  create(): Array<Promise<BilanParamsEntity>> {
    return bilanParamsSeed.map(async (item: BilanParamsModel) => {
        return await this.bilanRepository
            .findOne({ libelle: item.libelle })
            .then(async dbresult => {
                // We check if a item already exists.
                // If it does don't create a new one.
                if (isDefined(dbresult)) {
                    return Promise.resolve(null);
                }
                return await this.bilanRepository.save(item);
            })
            .catch(error => Promise.reject(error));
        });
    }


}
