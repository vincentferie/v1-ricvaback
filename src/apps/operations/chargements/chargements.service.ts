
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isDefined } from 'class-validator';
import { unlinkSync } from 'fs';
import { responseRequest } from 'src/helpers/core/response-request';
import { TypeOrmHttpParamQuery } from 'src/helpers/core/typeorm-query';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { StateChargement } from 'src/helpers/enums/state.enum';
import { convertBase64 } from 'src/helpers/utils/convertBase64';
import { ILike, Raw, Repository } from 'typeorm';
import { ChargementEntity } from './chargement.entity';
import { ChargementModel } from './chargement.model';
import { FileChargementEntity } from './fiche-chargement/file-chargement.entity';
import { FileChargementModel } from './fiche-chargement/file-chargement.model';

@Injectable()
export class ChargementsService {

    constructor(
        @InjectRepository(ChargementEntity) private readonly entityRepository: Repository<ChargementEntity>,
        @InjectRepository(FileChargementEntity) private readonly subRepository: Repository<FileChargementEntity>,
    ) { }

    async save(payload: any, input: ChargementModel): Promise<ChargementEntity> {
        let result: any, exception: any;
        try {
            result = await this.entityRepository.save(input);
            if (isDefined(result)) {
                setImmediate(async () => {
                    const file: FileChargementModel | any = await convertBase64(input.file, 'Fiche de Transfert', './uploads/fiche-transfert/');
                    if (typeof file == 'object') {
                        file.chargement_id = result.id;
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

    async update(payload: any, input: object, primaryKey: string): Promise<ChargementEntity> {
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

    async validate(payload: any, primaryKey: string): Promise<ChargementEntity> {
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
            response.data.validity = true;
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

    async updateMode(payload: any, primaryKey: string, mode: SoftDelete): Promise<ChargementEntity> {
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

    async updateFile(payload: any, input: any, primaryKey: string): Promise<FileChargementEntity> {
        let exception: any, result: any;
        const response = await this.subRepository.findOne({ id: primaryKey });

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
                const file: FileChargementModel | any = await convertBase64(input, 'Fiche de Transfert', './uploads/fiche-transfert/');
                if (typeof file == 'object') {
                    // delete origin file
                    unlinkSync(path);
                    // Save
                    await this.subRepository.save({ ...response, ...file });
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
                query = await this.subRepository.findOne({ chargement_id: primaryKey });
                if (isDefined(query)) {
                    await this.subRepository.delete({ chargement_id: primaryKey });
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

    async find(payload: any, query: object): Promise<ChargementEntity[]> {
        let exception: any, result: any;

        try {
            const filtering = (payload.user.role_id == '0f3ab781-3c61-4cb7-af6f-510330e94a45' 
                                || payload.user.role_id == '79ac524c-6d0f-4c71-a332-3bec6409ee68') ?
                {
                    relations: ['campagne', 'provenance', 'zonage', 'exportateur', 'entrepot', 'speculation', 'fiche'],
                    where: [{ mode: SoftDelete.active }]
                } :
                {
                    relations: ['campagne', 'provenance', 'zonage', 'exportateur', 'entrepot', 'speculation', 'fiche'],
                    where: [{ superviseur_id: payload.user.id, mode: SoftDelete.active }]
                }
            const queryObject = Object.keys(query).length > 0 ? TypeOrmHttpParamQuery(query) : filtering;
            result = await this.entityRepository.find(queryObject);

            if (isDefined(result)) {
                result.forEach((element) => {
                    const delai = this.dayDiff(element.created, element.date_chargement);
                    element.decompte = delai > 1 ? delai + ' jrs' : delai + ' jr';
                }, result);

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

    async list(payload: any): Promise<ChargementEntity[]> {
        let exception: any, result: any;
        try {
            result = await this.entityRepository
                .createQueryBuilder("chargement")
                .leftJoin("admin_lot", "lots", "chargement.id = lots.chargement_id")
                .where("lots.chargement_id IS NULL")
                .andWhere("chargement.superviseur_id = :user::uuid", { user: payload.user.id })
                .andWhere("chargement.statut <> :state", { state: StateChargement.rejeter })
               // .andWhere("chargement.validity = :validity::boolean", { validity: true })
                .andWhere("chargement.mode = :mode", { mode: SoftDelete.active })
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

    async findPaginate(payload: any, query: any): Promise<ChargementEntity[]> {
        let exception: any, result: any, total: number;
        try {
            const filtering = (payload.user.role_id == '0f3ab781-3c61-4cb7-af6f-510330e94a45' 
                                || payload.user.role_id == '79ac524c-6d0f-4c71-a332-3bec6409ee68') ?
                {
                    relations: ['campagne', 'provenance', 'zonage', 'exportateur', 'entrepot', 'speculation', 'fiche'],
                    where: [{ mode: SoftDelete.active }]
                } :
                {
                    relations: ['campagne', 'provenance', 'zonage', 'exportateur', 'entrepot', 'speculation', 'fiche'],
                    where: [{ superviseur_id: payload.user.id, mode: SoftDelete.active }]
                };

            [result, total] = await this.entityRepository.findAndCount({
                ...filtering,
                order: {
                    //num_fiche: query.order ?? 'ASC',
                    created: query.order ?? 'DESC',
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

    async findPaginateResearch(payload: any, query: any): Promise<ChargementEntity[]> {
        let exception: any, result: any, total: number;
        try {
            const filtering = (payload.user.role_id == '0f3ab781-3c61-4cb7-af6f-510330e94a45' 
                                || payload.user.role_id == '79ac524c-6d0f-4c71-a332-3bec6409ee68') ?
                {
                    relations: ['campagne', 'provenance', 'zonage', 'exportateur', 'entrepot', 'speculation', 'fiche'],
                    where: [
                        {
                            num_fiche: Raw((columnAlias) => ` CAST(${columnAlias} AS TEXT) ILIKE :value`, { value: `%${query.query}%`}),
                            mode: SoftDelete.active
                        },
                        {
                            date_chargement: Raw((columnAlias) => `TO_CHAR(${columnAlias}, 'YYYY-MM-DD HH:MI:SS') ILIKE :value`, { value: `%${query.query}%`}),
                            mode: SoftDelete.active
                        },
                        {
                            tracteur: ILike(`%${query.query}%`),
                            mode: SoftDelete.active
                        },
                        {
                            remorque: ILike(`%${query.query}%`),
                            mode: SoftDelete.active
                        },
                        {
                            fournisseur: ILike(`%${query.query}%`),
                            mode: SoftDelete.active
                        },
                        {
                            contact_fournisseur: Raw((columnAlias) => ` CAST(${columnAlias} AS TEXT) ILIKE :value`, { value: `%${query.query}%`}),
                            mode: SoftDelete.active
                        },
                        {
                            transporteur: ILike(`%${query.query}%`),
                            mode: SoftDelete.active
                        }
                    ]
                } :
                {
                    relations: ['campagne', 'provenance', 'zonage', 'exportateur', 'entrepot', 'speculation', 'fiche'],
                    where: [
                        {
                            num_fiche: Raw((columnAlias) => ` CAST(${columnAlias} AS TEXT) ILIKE :value`, { value: `%${query.query}%`}),
                            superviseur_id: payload.user.id,
                            mode: SoftDelete.active
                        },
                        {
                            date_chargement: Raw((columnAlias) => `TO_CHAR(${columnAlias}, 'YYYY-MM-DD HH:MI:SS') ILIKE :value`, { value: `%${query.query}%`}),
                            superviseur_id: payload.user.id,
                            mode: SoftDelete.active
                        },
                        {
                            tracteur: ILike(`%${query.query}%`),
                            superviseur_id: payload.user.id,
                            mode: SoftDelete.active
                        },
                        {
                            remorque: ILike(`%${query.query}%`),
                            superviseur_id: payload.user.id,
                            mode: SoftDelete.active
                        },
                        {
                            fournisseur: ILike(`%${query.query}%`),
                            superviseur_id: payload.user.id,
                            mode: SoftDelete.active
                        },
                        {
                            contact_fournisseur: Raw((columnAlias) => ` CAST(${columnAlias} AS TEXT) ILIKE :value`, { value: `%${query.query}%`}),
                            superviseur_id: payload.user.id,
                            mode: SoftDelete.active
                        },
                        {
                            transporteur: ILike(`%${query.query}%`),
                            superviseur_id: payload.user.id,
                            mode: SoftDelete.active
                        }
                    ],
                };

            [result, total] = await this.entityRepository.findAndCount({
                ...filtering,
                order: { 
                    //num_fiche: query.order ?? 'ASC',
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

    async findMode(payload: any, mode: SoftDelete): Promise<ChargementEntity[]> {
        let exception: any, result: any;

        try {
            result = await this.entityRepository.find({ superviseur_id: payload.user.id, mode: mode });

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

    async findById(payload: any, primaryKey: string): Promise<ChargementEntity> {
        let exception: any, result: any;

        try {
            result = await this.entityRepository.findOne({ id: primaryKey, superviseur_id: payload.user.id });

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

    dayDiff(d1: string, d2: string) {
        const date1 = new Date(this.convertIsoDate(d1));
        const date2 = new Date(this.convertIsoDate(d2));
        var diff = Math.abs(date1.getTime() - date2.getTime());
        return Math.ceil(diff / (1000 * 3600 * 24));
    }
    
    convertIsoDate(str) {
        var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);

        return [date.getFullYear(), mnth, day].join("-");

    }
}
