import { Injectable, HttpException } from '@nestjs/common';
import { Connection,Repository, } from 'typeorm';
import { isDefined } from 'class-validator';
import { responseRequest } from 'src/helpers/core/response-request';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { StateLots } from 'src/helpers/enums/state.enum';
import { ZonageEntity } from 'src/apps/configurations/zonage/zonage.entity';

@Injectable()
export class InventaireService {

    constructor(
        private readonly connection: Connection,
        @InjectRepository(ZonageEntity) private readonly zonnageRepository: Repository<ZonageEntity>
        ){}

    async etatLotsAnalyseDetailles(query: any): Promise<any[]> {
        let exception: any, result = [];
        try {

          // Get lot empote 
            const nombreLotEmpote = await this.connection.query(`
                                            SELECT COUNT(*) as nombre
                                            FROM admin_lot lot
                                            INNER JOIN admin_lot_empote lotEmp ON lotEmp.lot_id = lot.id
                                            INNER JOIN admin_analyse ana ON ana.lot_id = lot.id
                                            WHERE lot.campagne_id = $1::uuid
                                            AND lot.entrepot_id = $2::uuid
                                            AND lot.validity = $3::boolean
                                            AND lot.mode = $4::admin_lot_mode_enum
                                            HAVING ((SUM(lot.sac_en_stock) - SUM(lotEmp.nbre_sacs)) = 0)
                                            `,[query.campagne, query.entrepot, true, SoftDelete.active]);
            const empotage = await this.connection.query(`
                                            SELECT (SUM(lot.sac_en_stock) - SUM(lotEmp.nbre_sacs)) as restant, SUM(lot.sac_en_stock) as stock, SUM(lot.poids_net) as poids, (SUM(lot.poids_net * ana.out_turn) / SUM(lot.poids_net)) as outturn
                                            FROM admin_lot lot
                                            INNER JOIN admin_lot_empote lotEmp ON lotEmp.lot_id = lot.id
                                            INNER JOIN admin_analyse ana ON ana.lot_id = lotEmp.lot_id
                                            WHERE lot.campagne_id = $1::uuid
                                            AND lot.entrepot_id = $2::uuid
                                            AND lot.validity = $3::boolean
                                            AND lot.mode = $4::admin_lot_mode_enum
                                            HAVING ((SUM(lot.sac_en_stock) - SUM(lotEmp.nbre_sacs)) = 0)
                                            `, [query.campagne, query.entrepot, true, SoftDelete.active]);
            let objetEmpotage;
            if(isDefined(nombreLotEmpote) && nombreLotEmpote.length > 0 && +nombreLotEmpote[0].nombre > 0){
                objetEmpotage = {
                    etat: +nombreLotEmpote[0].nombre >= 1 ? 'Totalement Empotés' : 'Totalement Empoté',
                    nombre: +nombreLotEmpote[0].nombre,
                    restant: +empotage[0].restant,
                    stock: +empotage[0].stock,
                    poids: +empotage[0].poids,
                    outturn: +empotage[0].outturn,
                };
            }else{
                objetEmpotage = {
                    etat: 'Empoté',
                    nombre: 0,
                    restant: 0,
                    stock: 0,
                    poids: 0,
                    outturn: 0,
                };
            }

            // Get lot Partiel
            const nombreLotPartiel = await this.connection.query(`
                                            SELECT COUNT(*) as nombre
                                            FROM admin_lot lot
                                            INNER JOIN admin_lot_empote lotEmp ON lotEmp.lot_id = lot.id
                                            INNER JOIN admin_analyse ana ON ana.lot_id = lot.id
                                            WHERE lot.campagne_id = $1::uuid
                                            AND lot.entrepot_id = $2::uuid
                                            AND lot.validity = $3::boolean
                                            AND lot.mode = $4::admin_lot_mode_enum
                                            HAVING ((SUM(lot.sac_en_stock) - SUM(lotEmp.nbre_sacs)) > 0)
                                            `,[query.campagne, query.entrepot, true, SoftDelete.active]);
            const partiel = await this.connection.query(`
                                            SELECT (SUM(lot.sac_en_stock) - SUM(lotEmp.nbre_sacs)) as restant, SUM(lot.sac_en_stock) as stock, SUM(lot.poids_net) as poids, (SUM(lot.poids_net * ana.out_turn) / SUM(lot.poids_net)) as outturn
                                            FROM admin_lot lot
                                            INNER JOIN admin_lot_empote lotEmp ON lotEmp.lot_id = lot.id
                                            INNER JOIN admin_analyse ana ON ana.lot_id = lot.id
                                            WHERE lot.campagne_id = $1::uuid
                                            AND lot.entrepot_id = $2::uuid
                                            AND lot.validity = $3::boolean
                                            AND lot.mode = $4::admin_lot_mode_enum
                                            HAVING ((SUM(lot.sac_en_stock) - SUM(lotEmp.nbre_sacs)) > 0)
                                            `, [query.campagne, query.entrepot, true, SoftDelete.active]);
            let objetPartiel;
            if(isDefined(nombreLotPartiel) && nombreLotPartiel.length > 0 && +nombreLotPartiel[0].nombre > 0){
                objetPartiel = {
                    etat: +nombreLotPartiel[0].nombre >= 1 ? 'Partiellement Empotés' : 'Partiellement Empoté',
                    nombre: +nombreLotPartiel[0].nombre,
                    restant: +partiel[0].restant,
                    stock: +partiel[0].stock,
                    poids: +partiel[0].poids,
                    outturn: +partiel[0].outturn,
                };
            }else{
                objetPartiel = {
                    etat: 'Empoté Partiellement',
                    nombre: 0,
                    restant: 0,
                    stock: 0,
                    poids: 0,
                    outturn: 0,
                };
            }

            // Get lot Non Empote
            const nombreLotStock = await this.connection.query(`
                                            SELECT COUNT(*) as nombre
                                            FROM admin_lot lot
                                            LEFT JOIN admin_lot_empote lotEmp ON lotEmp.lot_id = lot.id
                                            INNER JOIN admin_analyse ana ON ana.lot_id = lot.id
                                            WHERE lot.campagne_id = $1::uuid
                                            AND lot.entrepot_id = $2::uuid
                                            AND lot.validity = $3::boolean
                                            AND lot.mode = $4::admin_lot_mode_enum
                                            AND lotEmp.lot_id IS NULL
                                            `,[query.campagne, query.entrepot, true, SoftDelete.active]);
            const stock = await this.connection.query(`
                                            SELECT SUM(lot.sac_en_stock) as stock, SUM(lot.poids_net) as poids, (SUM(lot.poids_net * ana.out_turn) / SUM(lot.poids_net)) as outturn
                                            FROM admin_lot lot
                                            LEFT JOIN admin_lot_empote lotEmp ON lotEmp.lot_id = lot.id
                                            INNER JOIN admin_analyse ana ON ana.lot_id = lot.id
                                            WHERE lot.campagne_id = $1::uuid
                                            AND lot.entrepot_id = $2::uuid
                                            AND lot.validity = $3::boolean
                                            AND lot.mode = $4::admin_lot_mode_enum
                                            AND lotEmp.lot_id IS NULL
                                            `, [query.campagne, query.entrepot, true, SoftDelete.active]);
            let objetStock;
            if(isDefined(nombreLotStock) && nombreLotStock.length > 0 && +nombreLotStock[0].nombre > 0){
                objetStock = {
                    etat: +nombreLotStock[0].nombre >= 1 ? 'Non Empotés' : 'Non Empoté',
                    nombre: +nombreLotStock[0].nombre,
                    restant: 0,
                    stock: +stock[0].stock,
                    poids: +stock[0].poids,
                    outturn: +stock[0].outturn,
                };
            }else{
                objetStock = {
                    etat: 'Non Empoté',
                    nombre: 0,
                    restant: 0,
                    stock: 0,
                    poids: 0,
                    outturn: 0,
                };
            }

            result = [objetEmpotage, objetPartiel, objetStock];
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

    async etatLotsAnalyseGenerale(query: any): Promise<any[]> {
        let exception: any, result = [];
        try {

            // Get lot empote 
            const nombreLotEmpote = await this.connection.query(`
                                            SELECT COUNT(*) as nombre
                                            FROM admin_lot lot
                                            INNER JOIN admin_lot_empote lotEmp ON lotEmp.lot_id = lot.id
                                            INNER JOIN admin_analyse ana ON ana.lot_id = lot.id
                                            WHERE lot.campagne_id = $1::uuid
                                            AND lot.entrepot_id = $2::uuid
                                            AND lot.validity = $3::boolean
                                            AND lot.mode = $4::admin_lot_mode_enum
                                            `,[query.campagne, query.entrepot, true, SoftDelete.active]);
            const empotage = await this.connection.query(`
                                            SELECT (SUM(lot.sac_en_stock) - SUM(lotEmp.nbre_sacs)) as restant, SUM(lot.sac_en_stock) as stock, SUM(lot.poids_net) as poids, (SUM(lot.poids_net * ana.out_turn) / SUM(lot.poids_net)) as outturn
                                            FROM admin_lot lot
                                            INNER JOIN admin_lot_empote lotEmp ON lotEmp.lot_id = lot.id
                                            INNER JOIN admin_analyse ana ON ana.lot_id = lotEmp.lot_id
                                            WHERE lot.campagne_id = $1::uuid
                                            AND lot.entrepot_id = $2::uuid
                                            AND lot.validity = $3::boolean
                                            AND lot.mode = $4::admin_lot_mode_enum
                                            `, [query.campagne, query.entrepot, true, SoftDelete.active]);
            let objetEmpotage;
            if(isDefined(nombreLotEmpote) && nombreLotEmpote.length > 0 && +nombreLotEmpote[0].nombre > 0){
                objetEmpotage = {
                    etat: +nombreLotEmpote[0].nombre >= 1 ? 'Totalement Empotés' : 'Totalement Empoté',
                    nombre: +nombreLotEmpote[0].nombre,
                    restant: +empotage[0].restant,
                    stock: +empotage[0].stock,
                    poids: +empotage[0].poids,
                    outturn: +empotage[0].outturn,
                };
            }else{
                objetEmpotage = {
                    etat: 'Empoté',
                    nombre: 0,
                    restant: 0,
                    stock: 0,
                    poids: 0,
                    outturn: 0,
                };
            }

            // Get lot Non Empote
            const nombreLotStock = await this.connection.query(`
                                            SELECT COUNT(*) as nombre
                                            FROM admin_lot lot
                                            LEFT JOIN admin_lot_empote lotEmp ON lotEmp.lot_id = lot.id
                                            INNER JOIN admin_analyse ana ON ana.lot_id = lot.id
                                            WHERE lot.campagne_id = $1::uuid
                                            AND lot.entrepot_id = $2::uuid
                                            AND lot.validity = $3::boolean
                                            AND lot.mode = $4::admin_lot_mode_enum
                                            AND lotEmp.lot_id IS NULL
                                            `,[query.campagne, query.entrepot, true, SoftDelete.active]);
            const stock = await this.connection.query(`
                                            SELECT SUM(lot.sac_en_stock) as stock, SUM(lot.poids_net) as poids, (SUM(lot.poids_net * ana.out_turn) / SUM(lot.poids_net)) as outturn
                                            FROM admin_lot lot
                                            LEFT JOIN admin_lot_empote lotEmp ON lotEmp.lot_id = lot.id
                                            INNER JOIN admin_analyse ana ON ana.lot_id = lot.id
                                            WHERE lot.campagne_id = $1::uuid
                                            AND lot.entrepot_id = $2::uuid
                                            AND lot.validity = $3::boolean
                                            AND lot.mode = $4::admin_lot_mode_enum
                                            AND lotEmp.lot_id IS NULL
                                            `, [query.campagne, query.entrepot, true, SoftDelete.active]);
            let objetStock;
            if(isDefined(nombreLotStock) && nombreLotStock.length > 0 && +nombreLotStock[0].nombre > 0){
                objetStock = {
                    etat: +nombreLotStock[0].nombre >= 1 ? 'Non Empotés' : 'Non Empoté',
                    nombre: +nombreLotStock[0].nombre,
                    restant: 0,
                    stock: +stock[0].stock,
                    poids: +stock[0].poids,
                    outturn: +stock[0].outturn,
                };
            }else{
                objetStock = {
                    etat: 'Non Empoté',
                    nombre: 0,
                    restant: 0,
                    stock: 0,
                    poids: 0,
                    outturn: 0,
                };
            }

            result = [objetEmpotage, objetStock];
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

    async etatLotsAnalyseNantis(query: any): Promise<any[]> {
        let exception: any, result = [];
        try {
    
            // Get lot nanti 
            const nombreLotNantis = await this.connection.query(`
                                            SELECT COUNT(*) as nombre
                                            FROM admin_lot lot
                                            INNER JOIN admin_analyse ana ON ana.lot_id = lot.id
                                            WHERE lot.campagne_id = $1::uuid
                                            AND lot.entrepot_id = $2::uuid
                                            AND lot.statut = $3::admin_lot_statut_enum
                                            AND lot.validity = $4::boolean
                                            AND lot.mode = $5::admin_lot_mode_enum
                                            `,[query.campagne, query.entrepot, StateLots.nantis, true, SoftDelete.active]);
            const nantis = await this.connection.query(`
                                            SELECT SUM(lot.sac_en_stock) as stock, SUM(lot.poids_net) as poids, (SUM(lot.poids_net * ana.out_turn) / SUM(lot.poids_net)) as outturn
                                            FROM admin_lot lot
                                            INNER JOIN admin_analyse ana ON ana.lot_id = lot.id
                                            WHERE lot.campagne_id = $1::uuid
                                            AND lot.entrepot_id = $2::uuid
                                            AND lot.statut = $3::admin_lot_statut_enum
                                            AND lot.validity = $4::boolean
                                            AND lot.mode = $5::admin_lot_mode_enum
                                            `,[query.campagne, query.entrepot, StateLots.nantis, true, SoftDelete.active]);
            let objetNantis;
            if(isDefined(nombreLotNantis) && nombreLotNantis.length > 0){
                objetNantis = {
                    etat: +nombreLotNantis[0].nombre >= 1 ? 'Nantis' : 'Nanti',
                    nombre: +nombreLotNantis[0].nombre,
                    stock: +nantis[0].stock,
                    poids: +nantis[0].poids,
                    outturn: +nantis[0].outturn,
                };
            }else{
                objetNantis = {
                    etat: 'Nanti',
                    nombre: 0,
                    restant: 0,
                    stock: 0,
                    poids: 0,
                    outturn: 0,
                };
            }
    
            // Get lot non nanti ou relache
            const nombreLotOther = await this.connection.query(`
                                            SELECT COUNT(*) as nombre
                                            FROM admin_lot lot
                                            INNER JOIN admin_analyse ana ON ana.lot_id = lot.id
                                            WHERE lot.campagne_id = $1::uuid
                                            AND lot.entrepot_id = $2::uuid
                                            AND lot.statut IN ($3, $4::admin_lot_statut_enum, $5::admin_lot_statut_enum)
                                            AND lot.validity = $6::boolean
                                            AND lot.mode = $7::admin_lot_mode_enum
                                            `,[query.campagne, query.entrepot, null, StateLots.denantis, StateLots.relacher, true, SoftDelete.active]);
            const other = await this.connection.query(`
                                            SELECT SUM(lot.sac_en_stock) as stock, SUM(lot.poids_net) as poids, (SUM(lot.poids_net * ana.out_turn) / SUM(lot.poids_net)) as outturn
                                            FROM admin_lot lot
                                            INNER JOIN admin_analyse ana ON ana.lot_id = lot.id
                                            WHERE lot.campagne_id = $1::uuid
                                            AND lot.entrepot_id = $2::uuid
                                            AND lot.statut IN ($3, $4::admin_lot_statut_enum, $5::admin_lot_statut_enum)
                                            AND lot.validity = $6::boolean
                                            AND lot.mode = $7::admin_lot_mode_enum
                                            `,[query.campagne, query.entrepot, null, StateLots.denantis, StateLots.relacher, true, SoftDelete.active]);
            let objetOther;
            if(isDefined(nombreLotOther) && nombreLotOther.length > 0){
                objetOther = {
                    etat: +nombreLotOther[0].nombre >= 1 ? 'Non Nanti, Denanti ou relaché' : 'Non Nantis, Denantis ou relachés',
                    nombre: +nombreLotOther[0].nombre,
                    stock: +other[0].stock,
                    poids: +other[0].poids,
                    outturn: +other[0].outturn,
                };
            }else{
                objetOther = {
                    etat: 'Non Nanti, Denanti ou relaché',
                    nombre: 0,
                    restant: 0,
                    stock: 0,
                    poids: 0,
                    outturn: 0,
                };
            }

    
            result = [objetNantis, objetOther];
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

    async etatStatutLotsAnalyse(query: any): Promise<any[]> {
        let exception: any, result = [];
        try {
            
            const zonnage = await this.zonnageRepository.find({mode: SoftDelete.active});
    
            if(isDefined(zonnage) && zonnage.length > 0){
                for(const item of zonnage){
                    // Get lot  
                    const nombreLotStatut = await this.connection.query(`
                                                    SELECT COUNT(*) as nombre
                                                    FROM admin_lot lot
                                                    INNER JOIN admin_analyse ana ON ana.lot_id = lot.id
                                                    INNER JOIN admin_zonage_params zone ON zone.id = lot.zonage_id
                                                    WHERE lot.campagne_id = $1::uuid
                                                    AND lot.entrepot_id = $2::uuid
                                                    AND lot.zonage_id = $3::uuid
                                                    AND lot.validity = $4::boolean
                                                    AND lot.mode = $5::admin_lot_mode_enum
                                                            `,[query.campagne, query.entrepot, item.id, true, SoftDelete.active]);
                    const statut = await this.connection.query(`
                                                    SELECT SUM(lot.sac_en_stock) as stock, SUM(lot.poids_net) as poids, (SUM(lot.poids_net * ana.out_turn) / SUM(lot.poids_net)) as outturn
                                                    FROM admin_lot lot
                                                    INNER JOIN admin_analyse ana ON ana.lot_id = lot.id
                                                    INNER JOIN admin_zonage_params zone ON zone.id = lot.zonage_id
                                                    WHERE lot.campagne_id = $1::uuid
                                                    AND lot.entrepot_id = $2::uuid
                                                    AND lot.zonage_id = $3::uuid
                                                    AND lot.validity = $4::boolean
                                                    AND lot.mode = $5::admin_lot_mode_enum
                                                    `,[query.campagne, query.entrepot, item.id, true, SoftDelete.active]);
                    if(isDefined(nombreLotStatut) && nombreLotStatut.length > 0){
                        result.push({
                            libelle: item.libelle,
                            nombre: +nombreLotStatut[0].nombre,
                            stock: +statut[0].stock,
                            poids: +statut[0].poids,
                            outturn: +statut[0].outturn,
                        });
                    }else{
                        result.push({
                            libelle: item.libelle,
                            nombre: 0,
                            restant: 0,
                            stock: 0,
                            poids: 0,
                            outturn: 0,
                        });
                    }          
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

    async etatLotsAnalyseExportateur(query: any): Promise<any[]> {
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
                                            
                    // Get lot empote 
                    const nombreLotEmpote = await this.connection.query(`
                                                    SELECT COUNT(*) as nombre
                                                    FROM admin_lot lot
                                                    INNER JOIN admin_lot_empote lotEmp ON lotEmp.lot_id = lot.id
                                                    INNER JOIN admin_analyse ana ON ana.lot_id = lot.id
                                                    WHERE lot.campagne_id = $1::uuid
                                                    AND lot.entrepot_id = $2::uuid
                                                    AND lot.exportateur_id = $3::uuid
                                                    AND lot.validity = $4::boolean
                                                    AND lot.mode = $5::admin_lot_mode_enum
                                                    `,[query.campagne, query.entrepot, item.id, true, SoftDelete.active]);
                    const empotage = await this.connection.query(`
                                                    SELECT (SUM(lot.sac_en_stock) - SUM(lotEmp.nbre_sacs)) as restant, SUM(lot.sac_en_stock) as stock, SUM(lot.poids_net) as poids, (SUM(lot.poids_net * ana.out_turn) / SUM(lot.poids_net)) as outturn
                                                    FROM admin_lot lot
                                                    INNER JOIN admin_lot_empote lotEmp ON lotEmp.lot_id = lot.id
                                                    INNER JOIN admin_analyse ana ON ana.lot_id = lotEmp.lot_id
                                                    WHERE lot.campagne_id = $1::uuid
                                                    AND lot.entrepot_id = $2::uuid
                                                    AND lot.exportateur_id = $3::uuid
                                                    AND lot.validity = $4::boolean
                                                    AND lot.mode = $5::admin_lot_mode_enum
                                                    `,[query.campagne, query.entrepot, item.id, true, SoftDelete.active]);
                    if(isDefined(nombreLotEmpote) && nombreLotEmpote.length > 0 && +nombreLotEmpote[0].nombre > 0){
                        result.push({
                            exportateur: item.raison,
                            nombre: +nombreLotEmpote[0].nombre,
                            restant: +empotage[0].restant,
                            stock: +empotage[0].stock,
                            poids: +empotage[0].poids,
                            outturn: +empotage[0].outturn,
                        });
                    }else{
                        result.push({
                            exportateur: item.raison,
                            nombre: 0,
                            restant: 0,
                            stock: 0,
                            poids: 0,
                            outturn: 0,
                        });
                    }
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

    async inventaireLotsExportateur(query: any): Promise<any[]> {
        let exception: any, result = [];
        try {

            const queryResult = await this.connection.query(`
                                                    SELECT info.raison, zone.libelle, lot.numero_ticket_pese, lot.code_dechargement, 
                                                            lot.numero_lot, lot.date_dechargement, (lot.sac_en_stock - lotEmp.nbre_sacs) as restant, lot.sac_en_stock as stock, 
                                                            lot.poids_net as poids, ((lot.poids_net * ana.out_turn) / lot.poids_net) as outturn
                                                    FROM admin_lot lot
                                                    INNER JOIN admin_lot_empote lotEmp ON lotEmp.lot_id = lot.id
                                                    INNER JOIN admin_analyse ana ON ana.lot_id = lotEmp.lot_id
                                                    INNER JOIN admin_zonage_params zone ON zone.id = lot.zonage_id
                                                    INNER JOIN admin_exportateurs_groupement exp ON exp.id = lot.exportateur_id
                                                    INNER JOIN admin_information_exportateur info ON info.id = exp.exportateur_id
                                                    WHERE lot.campagne_id = $1::uuid
                                                    AND lot.entrepot_id = $2::uuid
                                                    AND lot.validity = $3::boolean
                                                    AND lot.mode = $4::admin_lot_mode_enum
                                                    `,[query.campagne, query.entrepot, true, SoftDelete.active]);
                    if(isDefined(queryResult) && queryResult.length > 0){
                        for(const item of queryResult){

                            result.push({
                                exportateur: item.raison,
                                type: item.libelle,
                                numeroLot: item.numero_lot,
                                numeroTicket: item.numero_ticket_pese,
                                codeDech: item.code_dechargement,
                                restant: +item.restant,
                                stock: +item.stock,
                                poids: +item.poids,
                                outturn: +item.outturn,
                                date: item.date_dechargement,
                                etat: (+item.restant == 0) ? 'Empotés' : 'Empotés Pariel / Non Empotés'
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
