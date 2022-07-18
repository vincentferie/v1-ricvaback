import { Injectable, HttpException } from '@nestjs/common';
import { Connection,Repository, } from 'typeorm';
import { isDefined } from 'class-validator';
import { responseRequest } from 'src/helpers/core/response-request';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { EntrepotEntity } from 'src/apps/configurations/entrepots/entrepot.entity';
import { CampagneOutturnEntity } from 'src/apps/configurations/campagne/outturn/outturn.entity';
import { AnalysesEntity } from '../analyse/analyse.entity';

@Injectable()
export class RapportExportateurService {

    constructor(
        private readonly connection: Connection,
        @InjectRepository(EntrepotEntity) private readonly entrepotRepository: Repository<EntrepotEntity>,
        @InjectRepository(CampagneOutturnEntity) private readonly campagneOutturnRepository: Repository<CampagneOutturnEntity>,
        @InjectRepository(AnalysesEntity) private readonly analyseRepository: Repository<AnalysesEntity>,
        
        ){}

    async repartitionLotTonnageSite(query: any): Promise<any[]> {
        let exception: any, result;
        try {

            const entrepot = await this.entrepotRepository.find({mode: SoftDelete.active});

            if(isDefined(entrepot) && entrepot.length > 0){
                let analyseResult = []; let nonAnalyseResult = []; let nbrTA = 0, nbrTN = 0, poidsTA = 0, poidsTN = 0; 
                for(const item of entrepot){  
                    // Get lot Analyse 
                    const nombreLotAnalyse = await this.connection.query(`
                                                    SELECT COUNT(*) as nombre
                                                    FROM admin_lot lot
                                                    INNER JOIN admin_analyse ana ON ana.lot_id = lot.id
                                                    WHERE lot.campagne_id = $1::uuid
                                                    AND lot.entrepot_id = $2::uuid
                                                    AND lot.exportateur_id = $3::uuid
                                                    AND lot.validity = $4::boolean
                                                    AND lot.mode = $5::admin_lot_mode_enum
                                                    `,[query.campagne, item.id, query.exportateur, true, SoftDelete.active]);

                    const analyse = await this.connection.query(`
                                                    SELECT SUM(lot.poids_net) as poids
                                                    FROM admin_lot lot
                                                    INNER JOIN admin_analyse ana ON ana.lot_id = lot.id
                                                    WHERE lot.campagne_id = $1::uuid
                                                    AND lot.entrepot_id = $2::uuid
                                                    AND lot.exportateur_id = $3::uuid
                                                    AND lot.validity = $4::boolean
                                                    AND lot.mode = $5::admin_lot_mode_enum
                                                    GROUP BY lot.entrepot_id
                                                    `,[query.campagne, item.id, query.exportateur, true, SoftDelete.active]);


                   if(isDefined(nombreLotAnalyse) && nombreLotAnalyse.length > 0 && +nombreLotAnalyse[0].nombre > 0){
                        analyseResult.push({
                            site: item.libelle,
                            nombre: +nombreLotAnalyse[0].nombre,
                            poids: +analyse[0].poids,
                        });
                        nbrTA = nbrTA + +nombreLotAnalyse[0].nombre;
                        poidsTA = poidsTA + +analyse[0].poids;
                    }

                    // Get lot Non Analyse 
                    const nombreLotNonAnalyse = await this.connection.query(`
                                                    SELECT COUNT(*) as nombre
                                                    FROM admin_lot lot
                                                    LEFT JOIN admin_analyse ana ON ana.lot_id = lot.id
                                                    WHERE lot.campagne_id = $1::uuid
                                                    AND lot.entrepot_id = $2::uuid
                                                    AND lot.exportateur_id = $3::uuid
                                                    AND lot.validity = $4::boolean
                                                    AND lot.mode = $5::admin_lot_mode_enum
                                                    AND ana.lot_id IS NULL
                                                    `,[query.campagne, item.id, query.exportateur, true, SoftDelete.active]);

                    const nonAnalyse = await this.connection.query(`
                                                    SELECT SUM(lot.poids_net) as poids
                                                    FROM admin_lot lot
                                                    LEFT JOIN admin_analyse ana ON ana.lot_id = lot.id
                                                    WHERE lot.campagne_id = $1::uuid
                                                    AND lot.entrepot_id = $2::uuid
                                                    AND lot.exportateur_id = $3::uuid
                                                    AND lot.validity = $4::boolean
                                                    AND lot.mode = $5::admin_lot_mode_enum
                                                    AND ana.lot_id IS NULL
                                                    GROUP BY lot.entrepot_id
                                                    `,[query.campagne, item.id, query.exportateur, true, SoftDelete.active]);
                    if(isDefined(nombreLotNonAnalyse) && nombreLotNonAnalyse.length > 0 && +nombreLotNonAnalyse[0].nombre > 0){
                        nonAnalyseResult.push({
                            site: item.libelle,
                            nombre: +nombreLotNonAnalyse[0].nombre,
                            poids: +nonAnalyse[0].poids,
                        });
                        nbrTN = nbrTN + +nombreLotNonAnalyse[0].nombre;
                        poidsTN = poidsTN + +nonAnalyse[0].poids;
                    }

                }
                result = {
                    analyse : {details: analyseResult, totalNbreLot: nbrTA, tonnageTotal : poidsTA},
                    nonAnalyse: {details: nonAnalyseResult, totalNbreLot: nbrTN, tonnageTotal : poidsTN}
                }
            }
            exception = await responseRequest({
                status: 'foundQuery',
                data: result,
                params: 1 
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
                    params: `Erreur de paramètre ${JSON.stringify(query)}`
                });
            }
        }
            throw new HttpException(exception[0], exception[1]);
        }

    async qualiteProduitsAnalyses(query: any): Promise<any[]> {
        let exception: any, result;
        try {

            const outturn = await this.campagneOutturnRepository.findOne({campagne_id: query.campagne, flag: query.flag, mode: SoftDelete.active});


                    const poidsOutturnMin = await this.connection.query(`
                                                    SELECT SUM(lot.poids_net) as poids
                                                    FROM admin_lot lot
                                                    INNER JOIN admin_analyse ana ON ana.lot_id = lot.id
                                                    WHERE lot.campagne_id = $1::uuid
                                                    AND lot.exportateur_id = $2::uuid
                                                    AND ana.out_turn < $3::float
                                                    AND lot.validity = $4::boolean
                                                    AND lot.mode = $5::admin_lot_mode_enum
                                                    `,[query.campagne, query.exportateur, +outturn.min_outtrun, true, SoftDelete.active]);

                    const poidsOutturnMax = await this.connection.query(`
                                                    SELECT SUM(lot.poids_net) as poids
                                                    FROM admin_lot lot
                                                    INNER JOIN admin_analyse ana ON ana.lot_id = lot.id
                                                    WHERE lot.campagne_id = $1::uuid
                                                    AND lot.exportateur_id = $2::uuid
                                                    AND ana.out_turn > $3::float
                                                    AND lot.validity = $4::boolean
                                                    AND lot.mode = $5::admin_lot_mode_enum
                                                    `,[query.campagne, query.exportateur, +outturn.max_outtrun, true, SoftDelete.active]);

                    const poidsOutturnMiddle = await this.connection.query(`
                                                    SELECT SUM(lot.poids_net) as poids
                                                    FROM admin_lot lot
                                                    INNER JOIN admin_analyse ana ON ana.lot_id = lot.id
                                                    WHERE lot.campagne_id = $1::uuid
                                                    AND lot.exportateur_id = $2::uuid
                                                    AND ana.out_turn BETWEEN $3::float AND $4::float
                                                    AND lot.validity = $5::boolean
                                                    AND lot.mode = $6::admin_lot_mode_enum
                                                    `,[query.campagne, query.exportateur, +outturn.min_outtrun, +outturn.max_outtrun, true, SoftDelete.active]);

            result = {
                outturnInferior : {
                    text: 'Outturn inférieur à '+ +outturn.min_outtrun,
                    poids: +poidsOutturnMin[0].poids
                },
                outturnSuperior : {
                    text: 'Outturn supérieur à '+ +outturn.max_outtrun,
                    poids: +poidsOutturnMax[0].poids
                },
                outturnBetween : {
                    text: 'Outturn entre '+ +outturn.min_outtrun +' et '+ +outturn.max_outtrun,
                    poids: +poidsOutturnMiddle[0].poids
                },
            }       
            exception = await responseRequest({
                    status: 'foundQuery',
                    data: result,
                    params: 1 
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
                    params: `Erreur de paramètre ${JSON.stringify(query)}`
                });
            }
        }
            throw new HttpException(exception[0], exception[1]);
        }
    
    async repartitionLots(query: any): Promise<any[]> {
        let exception: any, result :any, analyseResult: any, nonAnalyseResult;
        try {

                    const analyse = await this.connection.query(`
                                                    SELECT SUM(lot.poids_net) as poids
                                                    FROM admin_lot lot
                                                    INNER JOIN admin_analyse ana ON ana.lot_id = lot.id
                                                    WHERE lot.campagne_id = $1::uuid
                                                    AND lot.exportateur_id = $2::uuid
                                                    AND lot.validity = $3::boolean
                                                    AND lot.mode = $4::admin_lot_mode_enum
                                                    GROUP BY lot.entrepot_id
                                                    `,[query.campagne, query.exportateur, true, SoftDelete.active]);

                        analyseResult = {
                                        libelle: 'Lots analysés',
                                        poids: (isDefined(analyse) && analyse.length > 0) ? +analyse[0].poids : 0
                                        };
             
                    const nonAnalyse = await this.connection.query(`
                                                    SELECT SUM(lot.poids_net) as poids
                                                    FROM admin_lot lot
                                                    LEFT JOIN admin_analyse ana ON ana.lot_id = lot.id
                                                    WHERE ana.lot_id IS NULL
                                                    AND lot.campagne_id = $1::uuid
                                                    AND lot.exportateur_id = $2::uuid
                                                    AND lot.validity = $3::boolean
                                                    AND lot.mode = $4::admin_lot_mode_enum
                                                    `,[query.campagne, query.exportateur, true, SoftDelete.active]);

                        nonAnalyseResult = {
                                libelle: 'Lots non analysés',
                                poids: (isDefined(nonAnalyse) && nonAnalyse.length > 0) ? +nonAnalyse[0].poids : 0
                            };

                    result = {nonAnalyse: nonAnalyseResult, analyse: analyseResult};
                    console.log(nonAnalyse, analyse);

            exception = await responseRequest({
                status: 'foundQuery',
                data: result,
                params: 1 
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
                    params: `Erreur de paramètre ${JSON.stringify(query)}`
                });
            }
        }
            throw new HttpException(exception[0], exception[1]);
        }
           
    async inventaireLotsExportateur(query: any): Promise<any[]> {
        let exception: any, result = [];
        try {

            const queryResult = await this.connection.query(`
                                                    SELECT lot.id, zone.libelle as zonnage, entr.libelle as entrepot, chrg.tracteur, chrg.remorque, 
                                                            lot.numero_ticket_pese, lot.code_dechargement, 
                                                            lot.numero_lot, lot.date_dechargement, lot.poids_net
                                                    FROM admin_lot lot
                                                    INNER JOIN admin_zonage_params zone ON zone.id = lot.zonage_id
                                                    INNER JOIN admin_chargement chrg ON chrg.id = lot.chargement_id
                                                    INNER JOIN admin_entrepot entr ON entr.id = lot.entrepot_id
                                                    WHERE lot.campagne_id = $1::uuid
                                                    AND lot.exportateur_id = $2::uuid
                                                    AND lot.validity = $3::boolean
                                                    AND lot.mode = $4::admin_lot_mode_enum
                                                    `,[query.campagne, query.exportateur, true, SoftDelete.active]);
                    if(isDefined(queryResult) && queryResult.length > 0){
                        for(const item of queryResult){

                            const outturn = await this.analyseRepository.findOne({lot_id: item.id});

                            result.push({
                                entrepot: item.entrepot,
                                type: item.zonnage,
                                camion: item.tracteur,
                                remorque: item.remorque,
                                numeroLot: item.numero_lot,
                                numeroTicket: item.numero_ticket_pese,
                                codeDech: item.code_dechargement,
                                poids: +item.poids_net,
                                outturn: isDefined(outturn) ? outturn.out_turn : null,
                                date: item.date_dechargement,
                            });
                        }
                    }

            exception = await responseRequest({
                status: 'foundQuery',
                data: result,
                params: result.length 
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
                    params: `Erreur de paramètre ${JSON.stringify(query)}`
                });
            }
        }
            throw new HttpException(exception[0], exception[1]);
    }
    
}
