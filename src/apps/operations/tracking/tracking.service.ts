import { HttpException, HttpService, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { filterVgm } from 'src/helpers/functions/filter-vgm';
import { responseRequest } from 'src/helpers/core/response-request';
import { InjectRepository } from '@nestjs/typeorm';
import { TrackingVgmEntity } from './tracking-vgm.entity';
import { Repository } from 'typeorm';
import { isDefined } from 'class-validator';
import { TrackingVgmModel } from './tracking-vgm.model';
import { inputVgmModel } from './input-vgm.model';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';

export const FormData = require('form-data');
export const qs = require('querystring');

@Injectable()
export class TrackingBlService {

    constructor(
        @InjectRepository(TrackingVgmEntity) private readonly entityRepository: Repository<TrackingVgmEntity>,
        private http: HttpService) {}

    async vgmtracking(payload: any, input: inputVgmModel): Promise<any>{
      let result = [], exception: any;
      try {   
          
            for(const item of input.array){

                const word = item.replace(/\s/g, "").toString().trim();
                const word2 = word.replace("-", "").toString().trim();

                await this.entityRepository.findOne({conteneur: word2, statut: true})
                                            .then(async (value, campagne = input.campagne_id) =>{
                                                if(!isDefined(value)){
                                                    const inputVgm: any | TrackingVgmModel = {
                                                        campagne_id: campagne,
                                                        conteneur: word2, 
                                                        booking: null,
                                                        ligne_maritime: null,
                                                        poids: 0,
                                                        pont_bascule: null,
                                                        edition: null,
                                                        emission: null,
                                                        statut: false,
                                                        created_by: `${payload.user.nom} ${payload.user.prenoms}`,
                                                        created: new Date(Date.now())
                                                    };
                                                    await this.entityRepository.save(inputVgm);
                                                }
                                            })
                                            .catch((reason) =>  {throw reason});
                                        
            }

            const job = this.httpVgmLink(payload, input.campagne_id);
                  
            exception = await responseRequest({
                status: 'inserted',
                data: job ? `Les Jobs ont bien été demarrés.` : `Données innexistant pour demarrer un Job.`,
                params: null
            });

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

    async vgmJobRestart(payload: any, primaryKey: string){
        let result = [], exception: any;
        try {   

            const job = this.httpVgmLink(payload, primaryKey);
                  
            exception = await responseRequest({
                status: 'other',
                data: null,
                params: job ? `Les Jobs ont bien été redemarrés.` : `Aucun Job n'est prevu.`
            });

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
        }
        
    throw new HttpException(exception[0], exception[1]);

    }

    async find(payload: any, primaryKey: string): Promise<TrackingVgmEntity[]> {
        let exception: any, result: any;
        try {
            result = await this.entityRepository.find({campagne_id: primaryKey});
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
                    params: `Erreur de paramètre ${primaryKey}`
                });
            }
        }
        throw new HttpException(exception[0], exception[1]);

    }

    async findPaginate(payload: any, primaryKey: string, query: any): Promise<TrackingVgmEntity[]>{
        let exception: any, result: any, total: number;
        try {

            [result, total] = await this.entityRepository.findAndCount({
                relations:['campagne'],
                where:[{campagne_id: primaryKey, mode: SoftDelete.active}],
                order: {
                    edition: query.order ?? 'ASC',
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

    async httpVgmLink(payload: any, primaryKey: string) {
        const config = {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              connection: 'setTimeout=0'
            }
          };

            const unexec = await this.entityRepository.find({campagne_id: primaryKey, statut: false});
            let i = 1; 
            if(isDefined(unexec)){

                unexec.forEach(async (item) =>{
                    setImmediate(async () => {
                            const form = {conteneur: item.conteneur};
                            await this.http.post<Observable<AxiosResponse<any>>>(`https://vgmci.com/vgmtracking/models/tracking_base.php`, qs.stringify(form), config)
                            .toPromise()
                            .then(async (response: any) => {
                                let res = null;
                                if (response != null && response.data != null) {
                                    res = response.data[1];
                                }
                                const requestFiltering = filterVgm(res, item.conteneur);
                                if(requestFiltering.statut === true){
                                    item.booking = requestFiltering.booking; 
                                    item.ligne_maritime = requestFiltering.ligneMaritime; 
                                    item.poids = requestFiltering.vgmCertifie; 
                                    item.pont_bascule = requestFiltering.pontBascule; 
                                    item.edition = requestFiltering.dateEdition; 
                                    item.emission = requestFiltering.dateEmission; 
                                    item.statut = requestFiltering.statut;
                                    item.updated = new Date(Date.now());
                                    item.updated_by = `${payload.user.nom} ${payload.user.prenoms}`;
                                    await this.entityRepository.save(item);
                                }

                            });
                        });
                       // }, 40000 * i);
                        i++;
                    });
                    return true;
            }
            return false
    }



}
