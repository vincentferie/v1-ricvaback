
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isDefined } from 'class-validator';
import { unlinkSync } from 'fs';
import { EntrepotEntity } from 'src/apps/configurations/entrepots/entrepot.entity';
import { responseRequest } from 'src/helpers/core/response-request';
import { TypeOrmHttpParamQuery } from 'src/helpers/core/typeorm-query';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { StateLots } from 'src/helpers/enums/state.enum';
import { convertBase64 } from 'src/helpers/utils/convertBase64';
import { ILike, Raw, Repository } from 'typeorm';
import { ChargementEntity } from '../chargements/chargement.entity';
import { LotEmpoteEntity } from '../empotage/lot-empote/lot-empote.entity';
import { FileTicketEntity } from './file-ticket/file-ticket-pesee.entity';
import { FileTicketModel } from './file-ticket/file-ticket-pesee.model';
import { LotEntity } from './lot.entity';
import { LotModel } from './lot.model';

@Injectable()
export class LotsService {
    constructor(
        @InjectRepository(LotEntity) private readonly entityRepository: Repository<LotEntity>,
        @InjectRepository(FileTicketEntity) private readonly subRepository: Repository<FileTicketEntity>,
        @InjectRepository(ChargementEntity) private readonly defRepository: Repository<ChargementEntity>,
        @InjectRepository(EntrepotEntity) private readonly specRepository: Repository<EntrepotEntity>,
    ) { }

    async save(payload:any, input: LotModel): Promise<LotEntity> {
        let result: any, exception: any;
        try {
            
            const resultChargement = await this.defRepository.findOne({
                    relations:['campagne', 'provenance', 'zonage', 'exportateur', 'entrepot', 'speculation'],
                    where:[{id: input.chargement_id, mode: SoftDelete.active}]
                });
            if(!isDefined(resultChargement)){ 
                exception = await responseRequest({
                    status: 'errorFound',
                    data: resultChargement,
                    params: `Aucun element ne correspont au paramètre chargement ${input.chargement_id}`
                });
                throw new HttpException(exception[0], exception[1]);         
            }   
            const resultLot: any = await this.entityRepository.createQueryBuilder("lot")
                                                            .select("COUNT(lot.id)", "nbreLot")
                                                            .where("lot.date_dechargement BETWEEN :deb::timestamp AND :fin::timestamp", 
                                                            { 
                                                                deb: this.convertIsoDate(resultChargement.campagne.ouverture), 
                                                                fin: this.convertIsoDate(resultChargement.campagne.fermeture)
                                                            }).getRawOne();
            
            const final: LotModel = {
                    ...input,
                    ...{
                        campagne_id: resultChargement.campagne_id,
                        superviseur_id: resultChargement.superviseur_id,
                        site_id: resultChargement.entrepot.site_id,
                        entrepot_id: resultChargement.entrepot_id,
                        exportateur_id: resultChargement.exportateur_id,
                        speculation_id: resultChargement.speculation_id,
                        zonage_id: resultChargement.zonage_id,
                        code_dechargement: await this.genUnicity(resultChargement, resultLot.nbreLot)
                    }
                };

                result = await this.entityRepository.save(final);
                if (isDefined(result)) {
                    // Save file logo
                    setImmediate(async () => {
                        const file: FileTicketModel | any = await convertBase64(input.file, 'Ticket de Pesee', './uploads/ticket-pesee/');
                        if(typeof file == 'object') {
                            file.lot_id = result.id;
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

    async update(payload:any, input: object, primaryKey: string): Promise<LotEntity> {
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

    async validate(payload:any, primaryKey: string): Promise<LotEntity> {
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

    async nantissement(payload:any, primaryKey: string): Promise<LotEntity> {
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
            response.data.statut = StateLots.nantis;
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

    async updateMode(payload:any, primaryKey: string, mode: SoftDelete): Promise<LotEntity> {
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

    async updateFile(payload:any, input: any, primaryKey: string): Promise<FileTicketEntity>{
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
                    const file: FileTicketModel | any = await convertBase64(input, 'Ticket de Pesee', './uploads/ticket-pesee/');
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
                let query;
                // Delete Lettre 
                query = await this.subRepository.findOne({lot_id: primaryKey});
                    if(isDefined(query)){
                        await this.subRepository.delete({lot_id: primaryKey});
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

    async find(payload:any, query: object): Promise<LotEntity[]> {
        let exception: any, result: any;

        try {
            
            const filtering = (payload.user.role_id == '0f3ab781-3c61-4cb7-af6f-510330e94a45' 
                                || payload.user.role_id == '79ac524c-6d0f-4c71-a332-3bec6409ee68') ?
            {
                relations:['campagne', 'site', 'zonage', 'exportateur', 'entrepot', 'speculation', 'file', 'chargement', 'analyses', 'transferts', 'session', 'balayures', 'balances'],
                where:[{mode: SoftDelete.active}]
            } : {
                relations:['campagne', 'site', 'zonage', 'exportateur', 'entrepot', 'speculation', 'file', 'chargement', 'analyses', 'transferts', 'session', 'balayures', 'balances'],
                where:[{superviseur_id: payload.user.id, mode: SoftDelete.active}],
                
            };
            
            const queryObject = Object.keys(query).length > 0 ? TypeOrmHttpParamQuery(query) : filtering;
            result = await this.entityRepository.find(queryObject);

            if (isDefined(result)) {
                exception = await responseRequest({
                    status: 'foundQuery',
                    data: result,
                    params: result.length
                });
            }
        } catch (error) {
            console.log(error);

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

    async findPaginate(payload: any, query: any): Promise<LotEntity[]>{
        let exception: any, result: any, total: number;
        try {
            const filtering = (payload.user.role_id == '0f3ab781-3c61-4cb7-af6f-510330e94a45' 
                                || payload.user.role_id == '79ac524c-6d0f-4c71-a332-3bec6409ee68') ?
            {
                relations:['campagne', 'site', 'zonage', 'exportateur', 'entrepot', 'speculation', 'file', 'chargement', 'analyses', 'transferts', 'session', 'balayures', 'balances'],
                where:[{mode: SoftDelete.active}]
            } : 
            {
                relations:['campagne', 'site', 'zonage', 'exportateur', 'entrepot', 'speculation', 'file', 'chargement', 'analyses', 'transferts', 'session', 'balayures', 'balances'],
                where:[{superviseur_id: payload.user.id, mode: SoftDelete.active}]
            };

            [result, total] = await this.entityRepository.findAndCount({
                ...filtering,
                order: {
                    //numero_ticket_pese: query.order ?? 'ASC',
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

    async findPaginateResearch(payload: any, query: any): Promise<LotEntity[]>{
        let exception: any, result: any, total: number;
        try {
            const filtering = (payload.user.role_id == '0f3ab781-3c61-4cb7-af6f-510330e94a45' 
                                || payload.user.role_id == '79ac524c-6d0f-4c71-a332-3bec6409ee68') ?
            {
                relations:['campagne', 'site', 'zonage', 'exportateur', 'entrepot', 'speculation', 'file', 'chargement', 'analyses', 'transferts', 'session', 'balayures', 'balances'],
                where:[
                    {
                        numero_ticket_pese: Raw((columnAlias) => `CAST(${columnAlias} AS TEXT) ILIKE :value`, { value: `%${query.query}%`}),
                        mode: SoftDelete.active
                    },
                    {
                        code_dechargement: ILike(`%${query.query}%`),
                        mode: SoftDelete.active
                    },
                    {
                        numero_lot: Raw((columnAlias) => `CAST(${columnAlias} AS VARCHAR) ILIKE :value`, { value: `%${query.query}%`}),
                        mode: SoftDelete.active
                    },
                    {
                        sac_en_stock: Raw((columnAlias) => `CAST(${columnAlias} AS TEXT) ILIKE :value`, { value: `%${query.query}%`}),
                        mode: SoftDelete.active
                    },
                    {
                        reconditionne: Raw((columnAlias) => `CAST(${columnAlias} AS TEXT) ILIKE :value`, { value: `%${query.query}%`}),
                        mode: SoftDelete.active
                    },
                    {
                        tare_emballage_refraction: Raw((columnAlias) => `CAST(${columnAlias} AS TEXT) ILIKE :value`, { value: `%${query.query}%`}),
                        mode: SoftDelete.active
                    },
                    {
                        sacs_decharge: Raw((columnAlias) => `CAST(${columnAlias} AS TEXT) ILIKE :value`, { value: `%${query.query}%`}),
                        mode: SoftDelete.active
                    },
                    {
                        poids_net: Raw((columnAlias) => `CAST(${columnAlias} AS TEXT) ILIKE :value`, { value: `%${query.query}%`}),
                        mode: SoftDelete.active
                    },
                    {
                        date_dechargement: Raw((columnAlias) => `TO_CHAR(${columnAlias}, 'YYYY-MM-DD HH:MI:SS') ILIKE :value`, { value: `%${query.query}%`}),
                        mode: SoftDelete.active
                    }
                ]
            } : 
            {
                relations:['campagne', 'site', 'zonage', 'exportateur', 'entrepot', 'speculation', 'file', 'chargement', 'analyses', 'transferts', 'session', 'balayures', 'balances'],
                where:[
                    {
                        numero_ticket_pese: Raw((columnAlias) => `CAST(${columnAlias} AS TEXT) ILIKE :value`, { value: `%${query.query}%`}),
                        superviseur_id: payload.user.id, 
                        mode: SoftDelete.active
                    },
                    {
                        code_dechargement: ILike(`%${query.query}%`),
                        superviseur_id: payload.user.id, 
                        mode: SoftDelete.active
                    },
                    {
                        numero_lot: Raw((columnAlias) => `CAST(${columnAlias} AS TEXT) ILIKE :value`, { value: `%${query.query}%`}),
                        superviseur_id: payload.user.id, 
                        mode: SoftDelete.active
                    },
                    {
                        sac_en_stock: Raw((columnAlias) => `CAST(${columnAlias} AS TEXT) ILIKE :value`, { value: `%${query.query}%`}),
                        superviseur_id: payload.user.id, 
                        mode: SoftDelete.active
                    },
                    {
                        reconditionne: Raw((columnAlias) => `CAST(${columnAlias} AS TEXT) ILIKE :value`, { value: `%${query.query}%`}),
                        superviseur_id: payload.user.id, 
                        mode: SoftDelete.active
                    },
                    {
                        tare_emballage_refraction: Raw((columnAlias) => `CAST(${columnAlias} AS TEXT) ILIKE :value`, { value: `%${query.query}%`}),
                        superviseur_id: payload.user.id, 
                        mode: SoftDelete.active
                    },
                    {
                        sacs_decharge: Raw((columnAlias) => `CAST(${columnAlias} AS TEXT) ILIKE :value`, { value: `%${query.query}%`}),
                        superviseur_id: payload.user.id, 
                        mode: SoftDelete.active
                    },
                    {
                        poids_net: Raw((columnAlias) => `CAST(${columnAlias} AS TEXT) ILIKE :value`, { value: `%${query.query}%`}),
                        superviseur_id: payload.user.id, 
                        mode: SoftDelete.active
                    },
                    {
                        date_dechargement: Raw((columnAlias) => `TO_CHAR(${columnAlias}, 'YYYY-MM-DD HH:MI:SS') ILIKE :value`, { value: `%${query.query}%`}),
                        superviseur_id: payload.user.id, 
                        mode: SoftDelete.active
                    }
                ],
            };

            [result, total] = await this.entityRepository.findAndCount({
                                    ...filtering,
                                    order: { 
                                        //numero_ticket_pese: query.order ?? 'ASC',
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
    
    async listNantissement(payload: any): Promise<LotEntity[]>{
        let exception: any, result: any;
        try {
            result = await this.entityRepository
                                .createQueryBuilder("lots")
                                .innerJoin("lots.analyses", "analyse", "lots.id = analyse.lot_id")
                                .leftJoin("admin_lots_nantis", "nantis", "lots.id = nantis.lot_id")
                                .where("nantis.lot_id IS NULL")
                                .andWhere("lots.validity = :validity::boolean", {validity: true})
                                .andWhere("lots.statut = :state::admin_lot_statut_enum", {state: StateLots.nantis})
                                .andWhere("lots.mode = :mode",{mode : SoftDelete.active})
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

    async listNonEmpotage(payload: any, primaryKey: string): Promise<LotEntity[]>{
        let exception: any, result: any;
        try {
            const isNullLotEmpote = await this.entityRepository
                                            .createQueryBuilder("lots")
                                            .innerJoinAndSelect("lots.analyses", "analyses", "lots.id = analyses.lot_id")
                                            .leftJoin("lots.lotEmpote", "lotEmpote", "lots.id = lotEmpote.lot_id")
                                            .where("lotEmpote.lot_id IS NULL")
                                            .andWhere("lots.entrepot_id = :entrepot::uuid", {entrepot: primaryKey})
                                            .andWhere("lots.superviseur_id = :id::uuid", {id: payload.user.id})
                                            .andWhere("lots.validity = :validity::boolean", {validity: true})
                                            .andWhere("lots.statut IS NULL")
                                            .orWhere("lots.statut = :state::admin_lot_statut_enum", {state: StateLots.relacher})
                                            .andWhere("lots.mode = :mode::admin_lot_mode_enum", {mode: SoftDelete.active})
                                            .getMany();

            const isNotNullLotEmpote = await this.entityRepository.createQueryBuilder("lots")
                                            .innerJoinAndSelect("lots.analyses", "analyses", "lots.id = analyses.lot_id")
                                            .innerJoinAndSelect("lots.lotEmpote", "lotEmpote", "lots.id = lotEmpote.lot_id")
                                            .addSelect("(lots.sac_en_stock - SUM(lotEmpote.nbre_sacs))", "sac_restant")
                                            .where("lots.superviseur_id = :user::uuid", {user: payload.user.id})
                                            .andWhere("lots.validity = :validity::boolean", {validity: true})
                                            .andWhere("lots.entrepot_id = :entrepot::uuid", {entrepot: primaryKey})
                                            .andWhere("lots.statut IS NULL")
                                            .orWhere("lots.statut = :state::admin_lot_statut_enum", {state: StateLots.relacher})
                                            .andWhere("lots.mode = :mode::admin_lot_mode_enum",{mode : SoftDelete.active})
                                            .groupBy("lots.sac_en_stock")
                                            .addGroupBy('lots.id')
                                            .addGroupBy('analyses.id')
                                            .addGroupBy('lotEmpote.id')
                                            .having("(lots.sac_en_stock - SUM(lotEmpote.nbre_sacs)) > 0")
                                            .getMany();

           result = isNullLotEmpote.concat(isNotNullLotEmpote);
           result = [...new Set([...isNullLotEmpote,...isNotNullLotEmpote])];
            //result = isNullLotEmpote;

            if (isDefined(result)) {
                exception = await responseRequest({
                    status: 'foundQuery',
                    data: result,
                    params: result.length
                });
            }

        } catch (error) {
            console.log(error);

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

    async listNonAnalyse(payload: any): Promise<LotEntity[]>{
        let exception: any, result: any;
        try {
            result = await this.entityRepository
                                .createQueryBuilder("lots")
                                .leftJoin("admin_analyse", "lotAnalyse", "lots.id = lotAnalyse.lot_id")
                                .where("lotAnalyse.lot_id IS NULL")
                                .andWhere("lots.validity = :validity::boolean", {validity: true})
                                .andWhere("lots.superviseur_id = :user::uuid", {user: payload.user.id})
                                .andWhere("lots.mode = :mode",{mode : SoftDelete.active})
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

    async listNonTransfert(payload: any): Promise<LotEntity[]>{
        let exception: any, result: any;
        try {
            result = await this.entityRepository
                                .createQueryBuilder("lots")
                                .leftJoin("admin_transfert", "lotTransfert", "lots.id = lotTransfert.lot_id")
                                .where("lotTransfert.lot_id IS NULL")
                                .andWhere("lots.validity = :validity::boolean", {validity: true})
                                .andWhere("lots.superviseur_id = :user::uuid", {user: payload.user.id})
                                .andWhere("lots.mode = :mode",{mode : SoftDelete.active})
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

    async listNonSession(payload: any): Promise<LotEntity[]>{
        let exception: any, result: any;
        try {
            result = await this.entityRepository
                                .createQueryBuilder("lots")
                                .leftJoin("admin_session", "lotSession", "lots.id = lotSession.lot_id")
                                .where("lotSession.lot_id IS NULL")
                                .andWhere("lots.validity = :validity::boolean", {validity: true})
                                .andWhere("lots.superviseur_id = :user::uuid", {user: payload.user.id})
                                .andWhere("lots.mode = :mode",{mode : SoftDelete.active})
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

    async findOption(payload:any, query: object): Promise<LotEntity[]> {
        let exception: any, result: any, total: number;
        const queryConst: any = query;
        try {
            const totalItem = await this.entityRepository.count();
            [result, total] = await this.entityRepository.findAndCount(query);

            if (isDefined(result)) {
                exception = await responseRequest({
                    status: 'foundQuery',
                    data: result,
                    params: result.length,
                });
                // Set Meta Pagination information
                exception[0].response.meta = {
                    itemCount: total,
                    totalItems: totalItem,
                    itemsPerPage: queryConst.take,
                    totalPages: Math.round(totalItem / queryConst.take),
                    currentPage: (queryConst.skip + 1),
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

    async findMode(payload:any, mode: SoftDelete): Promise<LotEntity[]> {
        let exception: any, result: any;

        try {
            result = await this.entityRepository.find({ 
                relations:['campagne', 'site', 'zonage', 'exportateur', 'entrepot', 'speculation', 'file', 'chargement', 'analyses', 'transferts', 'session', 'balayures', 'balances'],
                where: [{mode: mode , superviseur_id: payload.user.id}]
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

    async findById(payload:any, primaryKey: string): Promise<LotEntity> {
        let exception: any, result: any;

        try {
            result = await this.entityRepository.findOne({
                relations:['campagne', 'site', 'zonage', 'exportateur', 'entrepot', 'speculation', 'file', 'chargement', 'analyses', 'transferts', 'session', 'balayures', 'balances'],
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

    async genUnicity(objectData: any, countLot): Promise<string>{
        const nbrLot = (countLot + 1).toString().padStart(5, '0'); // Parse Number to 00000
        const entrepotResult = await this.specRepository.findOne({id: objectData.entrepot.id});
        const entrepotName = entrepotResult.libelle.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(' ', '-');
        const exportNameOrign = objectData.exportateur.exportateur.raison;
        const dates = `${this.convertIsoDate(objectData.campagne.ouverture)}***${this.convertIsoDate(objectData.campagne.fermeture)}`;

        let exportName: string;

        if(exportNameOrign.indexOf(' ') != -1){
            const splited = exportNameOrign.split(' ');
            if(splited.length >= 3){
                exportName = splited[0].substring(0, 2) + splited[1].substring(0, 2) + splited[2].substring(0, 1);
            }else{
                exportName = splited[0].substring(0, 2) + splited[1].substring(0, 3);
            }
        }else{
            if(exportNameOrign.length > 5){
                exportName = exportNameOrign.slice(0, 5);
            }else{
                exportName = exportNameOrign;
            }

        }
        // 
        return `${(dates+'/'+entrepotName+'/'+exportName+'/'+nbrLot).replace(' ', '').toUpperCase()}`;
        
    }

    convertIsoDate(str) {
        var date = new Date(str),
          mnth = ("0" + (date.getMonth() + 1)).slice(-2),
          day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
     }
}
