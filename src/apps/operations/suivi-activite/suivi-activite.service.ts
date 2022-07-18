import { Injectable, HttpException } from '@nestjs/common';
import { Connection,Repository, } from 'typeorm';
import { isDefined } from 'class-validator';
import { responseRequest } from 'src/helpers/core/response-request';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { SiteEntity } from 'src/apps/configurations/sites/site.entity';
import { EntrepotEntity } from 'src/apps/configurations/entrepots/entrepot.entity';
import { CampagneOutturnEntity } from 'src/apps/configurations/campagne/outturn/outturn.entity';

@Injectable()
export class SuiviActiviteService {
    constructor(
        private readonly connection: Connection,
        @InjectRepository(SiteEntity) private readonly siteRepository: Repository<SiteEntity>,
        @InjectRepository(EntrepotEntity) private readonly entrepotRepository: Repository<EntrepotEntity>,
        @InjectRepository(CampagneOutturnEntity) private readonly campagneOutturnRepository: Repository<CampagneOutturnEntity>,
    ){}

    async repartitionLotTonnageSiteVille(query: any): Promise<any[]> {
        let exception: any, result;
        try{
            const site = await this.siteRepository.find({mode: SoftDelete.active});
            let totalNombre = 0, totalPoids = 0; 
            let details = [];
            if(isDefined(site) && site.length > 0){
                for(const item of site){
                    let repartition = []; 
                    let subTotalNombre = 0, subTotalPoids = 0; 

                    // get entrepot
                        const entrepot = await this.entrepotRepository.find({site_id: item.id});
                        if(isDefined(entrepot) && entrepot.length > 0){
                            for(const value of entrepot){
                                // Get lot
                                const nombreLot = await this.connection.query(`
                                                    SELECT COUNT(*) as nombre
                                                    FROM admin_lot lot
                                                    WHERE lot.campagne_id = $1::uuid
                                                    AND lot.entrepot_id = $2::uuid
                                                    AND lot.validity = $3::boolean
                                                    AND lot.mode = $4::admin_lot_mode_enum
                                                    `,[query.campagne, value.id, true, SoftDelete.active]);

                                const tonnage = await this.connection.query(`
                                                    SELECT SUM(lot.poids_net) as poids
                                                    FROM admin_lot lot
                                                    WHERE lot.campagne_id = $1::uuid
                                                    AND lot.entrepot_id = $2::uuid
                                                    AND lot.validity = $3::boolean
                                                    AND lot.mode = $4::admin_lot_mode_enum
                                                    GROUP BY lot.entrepot_id
                                                    `,[query.campagne, value.id, true, SoftDelete.active]);

                                repartition.push({
                                    entrepot : value.libelle,
                                    nombreLot: (isDefined(nombreLot) && nombreLot.length > 0) ? +nombreLot[0].nombre : 0,
                                    poidsTotal: (isDefined(tonnage) && tonnage.length > 0) ? +tonnage[0].poids : 0
                                });
                                // Section
                                subTotalNombre = subTotalNombre + ((isDefined(nombreLot) && nombreLot.length > 0) ? +nombreLot[0].nombre : 0);
                                subTotalPoids = subTotalPoids + ((isDefined(tonnage) && tonnage.length > 0) ? +tonnage[0].poids : 0);
                                // All
                                totalNombre = totalNombre + ((isDefined(nombreLot) && nombreLot.length > 0) ? +nombreLot[0].nombre : 0);
                                totalPoids = totalPoids + ((isDefined(tonnage) && tonnage.length > 0) ? +tonnage[0].poids : 0);
                            }
                        }
                    details.push({
                        site: item.libelle,
                        repartition: repartition,
                        totalNbr : subTotalNombre,
                        totalPoids : subTotalPoids
                    });

                }
            }
            result = {
                details : details,
                total : {nbrTotal : totalNombre, poidsTotal : totalPoids}
            };

            exception = await responseRequest({
                status: 'foundQuery',
                data: result,
                params: 1
            });

        }catch (error) {
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

    async evolutionNiveauStockJournalier(query: any): Promise<any[]> {
        let exception: any, result;
        try{
            let variationData = [], poids = 0, evolutionData = [];
                const tonnage = await this.connection.query(`
                                                    SELECT lot.date_dechargement, SUM(lot.poids_net) as poids
                                                    FROM admin_lot lot
                                                    WHERE lot.campagne_id = $1::uuid
                                                    AND lot.validity = $2::boolean
                                                    AND lot.mode = $3::admin_lot_mode_enum
                                                    GROUP BY lot.date_dechargement
                                                    `,[query.campagne, true, SoftDelete.active]);

                if(isDefined(tonnage) && tonnage.length > 0){
                    for(const item of tonnage){
                        poids = poids + +item.poids;

                        variationData.push({
                            date: item.date_dechargement,
                            poids: +item.poids,
                        });
                        evolutionData.push({
                            date: item.date_dechargement,
                            poids: poids,
                        });
                    }
                }

            result = {
                variationStock: variationData,
                evolutionStock: evolutionData
            };
            exception = await responseRequest({
                status: 'foundQuery',
                data: result,
                params: 1
            });

        }catch (error) {
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

    async repartitionTonnageFonctionExportateurs(query: any): Promise<any[]> {
        let exception: any, result = [];
        try{

            const tonnageExportateur = await this.connection.query(`
                                                        SELECT info.raison, SUM(lot.poids_net) as poids
                                                        FROM admin_lot lot
                                                        INNER JOIN admin_exportateurs_groupement exp ON exp.id = lot.exportateur_id
                                                        INNER JOIN admin_information_exportateur info ON info.id = exp.exportateur_id
                                                        WHERE lot.campagne_id = $1::uuid
                                                        AND lot.validity = $2::boolean
                                                        AND lot.mode = $3::admin_lot_mode_enum
                                                        GROUP BY lot.exportateur_id, info.raison
                                                        ORDER BY poids DESC
                                                        `,[query.campagne, true, SoftDelete.active]);
                                                        
                    if(isDefined(tonnageExportateur) && tonnageExportateur.length > 0){
                        for( const item of tonnageExportateur){
                            result.push({
                                exportateur: item.raison,
                                poids: +item.poids
                            });
                        }   
                    }

            exception = await responseRequest({
                status: 'foundQuery',
                data: result,
                params: result.length
            });

        }catch (error) {
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

            const outturn = await this.campagneOutturnRepository.find({campagne_id: query.campagne, flag: query.flag, mode: SoftDelete.active});


                    const poidsOutturnMin = await this.connection.query(`
                                                    SELECT SUM(lot.poids_net) as poids
                                                    FROM admin_lot lot
                                                    INNER JOIN admin_analyse ana ON ana.lot_id = lot.id
                                                    WHERE lot.campagne_id = $1::uuid
                                                    AND ana.out_turn < $2::float
                                                    AND lot.validity = $3::boolean
                                                    AND lot.mode = $4::admin_lot_mode_enum
                                                    `,[query.campagne, +outturn[0].min_outtrun, true, SoftDelete.active]);

                    const poidsOutturnMax = await this.connection.query(`
                                                    SELECT SUM(lot.poids_net) as poids
                                                    FROM admin_lot lot
                                                    INNER JOIN admin_analyse ana ON ana.lot_id = lot.id
                                                    WHERE lot.campagne_id = $1::uuid
                                                    AND ana.out_turn > $2::float
                                                    AND lot.validity = $3::boolean
                                                    AND lot.mode = $4::admin_lot_mode_enum
                                                    `,[query.campagne, +outturn[0].max_outtrun, true, SoftDelete.active]);

                    const poidsOutturnMiddle = await this.connection.query(`
                                                    SELECT SUM(lot.poids_net) as poids
                                                    FROM admin_lot lot
                                                    INNER JOIN admin_analyse ana ON ana.lot_id = lot.id
                                                    WHERE lot.campagne_id = $1::uuid
                                                    AND ana.out_turn BETWEEN $2::float AND $3::float
                                                    AND lot.validity = $4::boolean
                                                    AND lot.mode = $5::admin_lot_mode_enum
                                                    `,[query.campagne, +outturn[0].min_outtrun, +outturn[0].max_outtrun, true, SoftDelete.active]);

            result = {
                outturnInferior : {
                    text: 'Outturn inférieur à '+ +outturn[0].min_outtrun,
                    poids: +poidsOutturnMin[0].poids
                },
                outturnSuperior : {
                    text: 'Outturn supérieur à '+ +outturn[0].max_outtrun,
                    poids: +poidsOutturnMax[0].poids
                },
                outturnBetween : {
                    text: 'Outturn entre '+ +outturn[0].min_outtrun +' et '+ +outturn[0].max_outtrun,
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
        let exception: any, result: any;
        try {
                let analyse, nonAnalyse: any;

                    const analyseResult = await this.connection.query(`
                                                    SELECT SUM(lot.poids_net) as poids
                                                    FROM admin_lot lot
                                                    INNER JOIN admin_analyse ana ON ana.lot_id = lot.id
                                                    WHERE lot.campagne_id = $1::uuid
                                                    AND lot.validity = $2::boolean
                                                    AND lot.mode = $3::admin_lot_mode_enum
                                                    `,[query.campagne, true, SoftDelete.active]);


                   if(isDefined(analyseResult) && analyseResult.length > 0){
                    analyse = {
                                    libelle: 'Lots analysés',
                                    poids: +analyseResult[0].poids
                                };
                    }

                    const nonAnalyseResult = await this.connection.query(`
                                                    SELECT SUM(lot.poids_net) as poids
                                                    FROM admin_lot lot
                                                    LEFT JOIN admin_analyse ana ON ana.lot_id = lot.id
                                                    WHERE lot.campagne_id = $1::uuid
                                                    AND lot.validity = $2::boolean
                                                    AND lot.mode = $3::admin_lot_mode_enum
                                                    AND ana.lot_id IS NULL
                                                    `,[query.campagne, true, SoftDelete.active]);
                    if(isDefined(nonAnalyseResult) && nonAnalyseResult.length > 0){
                        nonAnalyse = {
                                    libelle: 'Lots non analysés',
                                    poids: +nonAnalyseResult[0].poids
                                };
                    }
                    result = {'analyse': analyse, 'nonAnalyse': nonAnalyse};

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

    async repartitionLotsNonAnalyseEntrepot(query: any): Promise<any[]> {
        let exception: any, result = [];
        try {

                    const nonAnalyse = await this.connection.query(`
                                                    SELECT entr.libelle, SUM(lot.poids_net) as poids
                                                    FROM admin_lot lot
                                                    LEFT JOIN admin_analyse ana ON ana.lot_id = lot.id
                                                    LEFT JOIN admin_entrepot entr ON entr.id = lot.entrepot_id
                                                    WHERE lot.campagne_id = $1::uuid
                                                    AND lot.validity = $2::boolean
                                                    AND lot.mode = $3::admin_lot_mode_enum
                                                    AND ana.lot_id IS NULL
                                                    GROUP BY entr.libelle
                                                    `,[query.campagne, true, SoftDelete.active]);
                    if(isDefined(nonAnalyse) && nonAnalyse.length > 0){
                        for(const item of nonAnalyse){
                            result.push({
                                entrepot: item.libelle,
                                poids: +item.poids
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
                        data: result,
                        params: `Erreur de paramètre ${JSON.stringify(query)}`
                    });
                }
            }
                throw new HttpException(exception[0], exception[1]);
        }    

    async repartitionLotsExportateurEntrepot(query: any): Promise<any[]> {
        let exception: any, result = [];
        try {
            const exportateur = await this.connection.query(`
                                                SELECT expGrp.id, infos.raison
                                                FROM admin_exportateurs_groupement expGrp
                                                INNER JOIN admin_information_exportateur infos ON infos.id = expGrp.exportateur_id
                                                ORDER BY infos.raison ASC
                                                        `);
                if(isDefined(exportateur) && exportateur.length > 0){
                    for(const item of exportateur){
                        let arrayLot = []; let nombreTotal = 0, poidsTotal = 0;
                        // Get lot empote 

                            const lot = await this.connection.query(`
                                                            SELECT entr.libelle, SUM(lot.poids_net) as poids, COUNT(lot.id) as nombre
                                                            FROM admin_lot lot
                                                            LEFT JOIN admin_entrepot entr ON entr.id = lot.entrepot_id
                                                            WHERE lot.campagne_id = $1::uuid
                                                            AND lot.exportateur_id = $2::uuid
                                                            AND lot.validity = $3::boolean
                                                            AND lot.mode = $4::admin_lot_mode_enum
                                                            GROUP BY entr.libelle
                                                            `,[query.campagne, item.id, true, SoftDelete.active]);
                            if(isDefined(lot) && lot.length > 0){
                                for(const value of lot){
                                    nombreTotal = nombreTotal + +value.nombre;
                                    poidsTotal = poidsTotal + +value.poids;

                                    arrayLot.push({
                                        entrepot: value.libelle,
                                        nbrLot: +value.nombre,
                                        poids: +value.poids
                                    });
                                }
                            }
                            result.push({
                                exportateur: item.raison,
                                nombreTotalLot: nombreTotal,
                                poidsTotal: poidsTotal,
                                details: arrayLot
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
                        data: result,
                        params: `Erreur de paramètre ${JSON.stringify(query)}`
                    });
                }
            }
            throw new HttpException(exception[0], exception[1]);
        }    
            

}
