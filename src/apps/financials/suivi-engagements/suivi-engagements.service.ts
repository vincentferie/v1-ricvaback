import { Injectable, HttpException } from '@nestjs/common';
import { Connection,Repository, } from 'typeorm';
import { isDefined } from 'class-validator';
import { responseRequest } from 'src/helpers/core/response-request';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { CampagneSpecEntity } from 'src/apps/configurations/campagne-spec/campagne-spec.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BanquesEntity } from '../banques/banques.entity';
import { StateTirage } from 'src/helpers/enums/state.enum';
import { EntrepotEntity } from 'src/apps/configurations/entrepots/entrepot.entity';
//import moment from 'moment';
const moment = require("moment").default || require("moment");

@Injectable()
export class SuiviEngagementsService {

    constructor(
        @InjectRepository(CampagneSpecEntity) private readonly campagneRepository: Repository<CampagneSpecEntity>,
        @InjectRepository(EntrepotEntity) private readonly entrepotRepository: Repository<EntrepotEntity>,
        @InjectRepository(BanquesEntity) private readonly banqueRepository: Repository<BanquesEntity>,
        private readonly connection: Connection
    ) { }

    async situationFinancement(query: any): Promise<any[]> {
        let exception: any, result = [];
        
        try {
          // Get Price of Speculation  
        const prixSpeculation: any = await this.campagneRepository.findOne({ campagne_id:query.campagne, tag: query.tag, mode: SoftDelete.active});

        const exportateurPrefinance = await this.connection.query(`
                                                            SELECT DISTINCT(expGrp.id), infos.raison, SUM(pref.solde) as montant
                                                            FROM admin_exportateurs_groupement expGrp
                                                            INNER JOIN admin_information_exportateur infos ON infos.id = expGrp.exportateur_id
                                                            INNER JOIN admin_compte_exportateurs pref ON pref.exportateur_id = expGrp.id
                                                            WHERE expGrp.groupement_id = $1::uuid
                                                            AND pref.campagne_id = $2::uuid
                                                            AND pref.date_tirage BETWEEN $3::timestamp AND $4::timestamp
                                                            AND pref.mode = $5::admin_compte_exportateurs_mode_enum
                                                            GROUP BY expGrp.id, infos.raison
                                                            ORDER BY infos.raison ASC
                                                            `, [query.groupement, query.campagne, query.debut, query.fin, SoftDelete.active]);
          // Get Prefinancement exportateur

            if (isDefined(exportateurPrefinance) && exportateurPrefinance.length > 0) {
                for (const item of exportateurPrefinance) {
                    // Get All dechargement
                        const lotDecharge = await this.connection.query(` 
                                                                  SELECT SUM(poids_net) as totalpoids
                                                                  FROM admin_lot
                                                                  WHERE campagne_id = $1::uuid
                                                                  AND exportateur_id = $2::uuid
                                                                  AND validity = $3::boolean              
                                                                  AND mode = $4::admin_lot_mode_enum
                                                                  GROUP BY exportateur_id
                                                                    `, [query.campagne, item.id, true, SoftDelete.active]);
                        if(lotDecharge.length > 0){
                            for(const value of lotDecharge){
                            // Quantité a livrer
                            const qteAlivre = +item.montant / prixSpeculation.valeur;
                            const soldeKg = +value.totalpoids - qteAlivre;
                            const soleXof = (+value.totalpoids - qteAlivre) * prixSpeculation.valeur;

                            result.push({
                                'exportateur': item.raison,
                                'montantPrefinance': +item.montant,
                                'qteAlivre': qteAlivre,
                                'qteLivre': +value.totalpoids,
                                'soldeKg': soldeKg,
                                'soleXof': soleXof
                            });

                            }    
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

    async repartitionSolde(query: any): Promise<any[]> {
        let exception: any, result: any;
        
        try {
            // Get Price of Speculation  
        const prixSpeculation = await this.campagneRepository.findOne({ campagne_id:query.campagne, tag: query.tag, mode: SoftDelete.active});

        const exportateurPrefinance = await this.connection.query(`
                                                            SELECT DISTINCT(expGrp.id), infos.raison, SUM(pref.solde) as montant
                                                            FROM admin_exportateurs_groupement expGrp
                                                            INNER JOIN admin_information_exportateur infos ON infos.id = expGrp.exportateur_id
                                                            INNER JOIN admin_compte_exportateurs pref ON pref.exportateur_id = expGrp.id
                                                            WHERE expGrp.groupement_id = $1::uuid
                                                            AND pref.campagne_id = $2::uuid
                                                            AND pref.date_tirage BETWEEN $3::timestamp AND $4::timestamp
                                                            AND pref.mode = $5::admin_compte_exportateurs_mode_enum
                                                            GROUP BY expGrp.id, infos.raison
                                                            ORDER BY infos.raison ASC
                                                            `, [query.groupement, query.campagne, query.debut, query.fin, SoftDelete.active]);
        // Get Prefinancement exportateur
            if (isDefined(exportateurPrefinance) && exportateurPrefinance.length > 0) {
                let serieGIE = [];
                let serieExportateur = [];
                let categorie = [];

                for (const item of exportateurPrefinance) {
                    // Get All dechargement
                        const lotDecharge = await this.connection.query(` 
                                                                    SELECT SUM(poids_net) as totalpoids
                                                                    FROM admin_lot
                                                                    WHERE campagne_id = $1::uuid
                                                                    AND exportateur_id = $2::uuid
                                                                    AND validity = $3::boolean              
                                                                    AND mode = $4::admin_lot_mode_enum
                                                                    GROUP BY exportateur_id
                                                                      `, [query.campagne, item.id, true, SoftDelete.active]);
                        if(lotDecharge.length > 0){
                            categorie.push(item.raison); // Set exportateur categories

                            for(const value of lotDecharge){
                                // Quantité a livrer
                                const qteAlivre = +item.montant / Number(prixSpeculation.valeur);
                                //const soldeKg = value.totalpoids - qteAlivre;
                                const soleXof = (+value.totalpoids - qteAlivre) * Number(prixSpeculation.valeur);

                                if(soleXof < 0){
                                    serieGIE.push(soleXof);
                                    serieExportateur.push(null);
                                }else{
                                    serieExportateur.push(soleXof);
                                    serieGIE.push(null);
                                }

                            }
                        }
                    }
                
                result = {
                    categorie: categorie,// Array.from(new Set(categorie)),
                    serie:[{
                            name: 'Solde dû au GIE',
                            color: '#FF0000',
                            data: serieGIE
                        }, 
                        {
                            name: 'Solde dû aux Exportateurs',
                            color: '#00C5FE',
                            data: serieExportateur
                        }]
                    };
                }
                exception = await responseRequest({
                    status: 'foundQuery',
                    data: result,
                    params: Object.keys(result).length 
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

    async repartitionPoidsSiteBank(query: any): Promise<any[]> {
        let exception: any, result = [];
        
        try {
            // Get Price of Speculation  
            const prixSpeculation = await this.campagneRepository.findOne({ campagne_id:query.campagne, tag: query.tag, mode: SoftDelete.active});
            // Get Site
            const entrepotList = await this.entrepotRepository.find();
            // Get Bank
            const bankList = await this.banqueRepository.find({mode: SoftDelete.active});     
                                                                
            if(isDefined(bankList) && bankList.length > 0) {
                for (const item of bankList) {
                    let array = [];
                    const financement = await this.connection.query(`
                                                        SELECT SUM(compte.solde) as solde, compte.banque_id as id
                                                        FROM admin_compte_exportateurs compte
                                                        INNER JOIN admin_banques bank ON bank.id = compte.banque_id
                                                        WHERE bank.id = $1::uuid
                                                        AND compte.campagne_id = $2::uuid
                                                        AND compte.mode =$3
                                                        GROUP BY compte.banque_id
                                                    `, [item.id, query.campagne, SoftDelete.active]);
                    for(const tirage of financement) {

                        // Exportateur tonage
                        const qteAlivre = +tirage.solde / Number(prixSpeculation.valeur);
                        let exeQteAlivre = qteAlivre;
                        let i = 0;
                        if(isDefined(entrepotList) && entrepotList.length > 0){
                            for(const entrepot of entrepotList){
                                let poidsTotal = 0; let valeurPoids = 0;

                                const lotDecharge = await this.connection.query(` 
                                                                    SELECT SUM(lot.poids_net) as totalpoids
                                                                    FROM admin_lot lot
                                                                    INNER JOIN admin_compte_exportateurs compte ON compte.exportateur_id = lot.exportateur_id
                                                                    WHERE lot.campagne_id = $1::uuid
                                                                    AND lot.entrepot_id = $2::uuid
                                                                    AND lot.validity = $3::boolean     
                                                                    AND compte.banque_id = $4::uuid
                                                                    AND lot.mode = $5::admin_lot_mode_enum
                                                                    GROUP BY lot.exportateur_id
                                                    `, [query.campagne, entrepot.id, true, tirage.id, SoftDelete.active]);   
                                if(isDefined(lotDecharge) && lotDecharge.length > 0){
                                            poidsTotal = +lotDecharge[0].totalpoids;
                                            valeurPoids = +lotDecharge[0].totalpoids * Number(prixSpeculation.valeur);
                                }

                                const qteRestant = exeQteAlivre - poidsTotal;
                                exeQteAlivre = qteRestant;

                                array.push({
                                    entrepot: entrepot.libelle,
                                    poidsTotalLivre: poidsTotal,
                                    valeurPoidsTotalLivre: valeurPoids,
                                    qteAlivre: i == 0 ? qteAlivre : exeQteAlivre,
                                    qteRestant: qteRestant            
                                });
                            }

                        }
                    }

                    result.push({
                        banque: item.libelle,
                        repartition: array
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

    async financementExecution(query: any): Promise<any[]> {
        let exception: any, result = [];
        
        try {
                // Get Price of Speculation  
            const prixSpeculation = await this.campagneRepository.findOne({ campagne_id:query.campagne, tag: query.tag, mode: SoftDelete.active});

            const exportateurList = await this.connection.query(`SELECT exp.id, tenant.raison
                                                                    FROM admin_exportateurs_groupement exp
                                                                    INNER JOIN admin_information_exportateur tenant ON tenant.id = exp.exportateur_id
                                                                    WHERE exp.mode = $1::admin_exportateurs_groupement_mode_enum
                                                                `, [SoftDelete.active]);        

            if(isDefined(exportateurList) && exportateurList.length > 0) {
                for (const item of exportateurList) {
                    let array = [];
                    const financement = await this.connection.query(`SELECT compte.exportateur_id, bank.libelle, SUM(compte.solde) as solde, compte.date_tirage
                                                                        FROM admin_compte_exportateurs compte
                                                                        INNER JOIN admin_banques bank ON bank.id = compte.banque_id
                                                                        WHERE compte.exportateur_id = $1::uuid
                                                                        AND compte.campagne_id = $2::uuid
                                                                        GROUP BY compte.exportateur_id, bank.libelle, compte.date_tirage
                                                                        ORDER BY compte.date_tirage ASC
                                                                `, [item.id, query.campagne]);

                            let i = 0; const lengthOfTirage = financement.length; 
                            for (const value of financement) { 
                                        let j =i+1; // Tirage suivant
                                        let lotDecharge: any; let periode: string;
            
                                            const dateBedut = moment(value.date_tirage).format('YYYY-MM-DD hh:mm:ss');
                                            const dateSup = isDefined(financement[j]) ? financement[j].date_tirage : financement[i].date_tirage;
                                            const dateFin = moment(dateSup).format('YYYY-MM-DD hh:mm:ss');

                                                // Get change date
                                                if(i == (lengthOfTirage - 1)){
                                                    // Get All dechargement
                                                    lotDecharge = await this.connection.query(` 
                                                                        SELECT SUM(poids_net) as totalpoids
                                                                        FROM admin_lot
                                                                        WHERE campagne_id = $1::uuid
                                                                        AND exportateur_id = $2::uuid
                                                                        AND validity = $3::boolean              
                                                                        AND mode = $4::admin_lot_mode_enum
                                                                        AND date_dechargement BETWEEN $5::timestamp AND NOW()
                                                                        GROUP BY exportateur_id
                                                        `, [query.campagne, item.id, true, SoftDelete.active, dateFin]);
                                                        periode = '>= '+ dateFin;
                                                }
                                                else{
                                                    // Get All dechargement
                                                    lotDecharge = await this.connection.query(` 
                                                        SELECT SUM(poids_net) as totalpoids
                                                        FROM admin_lot
                                                        WHERE campagne_id = $1::uuid
                                                        AND exportateur_id = $2::uuid
                                                        AND validity = $3::boolean              
                                                        AND mode = $4::admin_lot_mode_enum
                                                        AND date_dechargement BETWEEN $5::timestamp AND $6::timestamp
                                                        GROUP BY exportateur_id
                                                        `, [query.campagne, item.id, true, SoftDelete.active, dateBedut, dateFin]);
                
                                                        periode = dateBedut+' à '+dateFin;
                                                }
                                            // Exportateur tonage
                                            if(lotDecharge.length > 0){
                                                const qteAlivre = +value.solde / Number(prixSpeculation.valeur);
                                                const qteRestant = +lotDecharge[0].totalpoids - qteAlivre;
                                                const valeurDecharger = +value.solde - (+lotDecharge[0].totalpoids * Number(prixSpeculation.valeur));
                
                                                array.push({
                                                        bank : value.libelle,
                                                        tirage : +value.solde,
                                                        tirageRestant : valeurDecharger,
                                                        qteALivre : qteAlivre,
                                                        qteLivre : +lotDecharge[0].totalpoids,
                                                        qteRestant : qteRestant,
                                                        periode : periode
                                                        });
                                            }
                                                i++; 
                            }
                            
                                result.push({
                                            exportateurId: item.id,
                                            exportateur: item.raison,
                                            details: array
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
 
    async dureeMoyenneFnancementDecouvertBanque(query: any): Promise <any[]> {
        let exception: any, result = [];
        
        try {
            const banque = await this.banqueRepository.find();

            if(isDefined(banque) && banque.length > 0){
                for(const item of banque){
                let duree = 0; let interet = 0;   
                const tirageMoy = await this.connection.query(`SELECT AVG(DATE_PART('day', NOW() - compte.date_tirage::timestamp)) as duree
                                                                    FROM admin_compte_exportateurs compte
                                                                    INNER JOIN admin_banques bank ON bank.id = compte.banque_id
                                                                    WHERE bank.id = $1::uuid
                                                                    AND compte.campagne_id = $2::uuid
                                                                    GROUP BY compte.exportateur_id, compte.date_tirage
                                                                    ORDER BY compte.date_tirage ASC
                                                            `, [item.id, query.campagne]);
                       if(isDefined(tirageMoy) && tirageMoy.length > 0){
                           for(const value of tirageMoy){
                            duree =  +value.duree;
                           }
                       }

                    const banqueSpec = await this.connection.query(`SELECT AVG(montant)as montant, taux
                                                                        FROM admin_banques_spec
                                                                        WHERE ligne ILIKE $1::text
                                                                        AND banque_id = $2::uuid
                                                                        GROUP BY banque_id, taux
                                                                    `,['%D#%', item.id]);
                
                   const tirageSpec = await this.connection.query(`SELECT DATE_PART('day', NOW() - compte.date_tirage::timestamp) as duree
                                                                FROM admin_compte_exportateurs compte
                                                                INNER JOIN admin_banques bank ON bank.id = compte.banque_id
                                                                WHERE bank.id = $1::uuid
                                                                AND compte.campagne_id = $2::uuid
                                                                GROUP BY compte.exportateur_id, compte.date_tirage
                                                                ORDER BY compte.date_tirage ASC
                                                        `, [item.id, query.campagne]);

                    if(isDefined(banqueSpec) && banqueSpec.length > 0 ){
                            for(const value of banqueSpec) {
                                if(isDefined(tirageSpec) && tirageSpec.length > 0 ){
                                    for(const key of tirageSpec){

                                        interet = interet + +value.montant * parseFloat(value.taux) * key.duree;
                                    }
                                }
                            }
                        }

                    result.push({
                        banque: item.libelle,
                        dureeMoy: duree,
                        interet : interet
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

    async dureeMoyenneFnancementNantissementBanque(query: any): Promise <any[]> {
        let exception: any, result = [];
        
        try {
            const banqueNantissement = await this.connection.query(`SELECT bank.id, bank.libelle
                                                                        FROM admin_banques bank
                                                                        INNER JOIN admin_nantissement nantis ON bank.id = nantis.banque_id
                                                                        GROUP BY bank.id
                                                                        ORDER BY bank.libelle ASC
                                                                `);

            if(isDefined(banqueNantissement) && banqueNantissement.length > 0){
                for(const item of banqueNantissement){
                let dateDenantissement; let details = []; let duree = 0;
                const nantissement = await this.connection.query(`SELECT id, numero_lettre, date_nantissement
                                                                    FROM admin_nantissement
                                                                    WHERE banque_id = $1::uuid
                                                                    AND campagne_id = $2::uuid
                                                                    ORDER BY numero_lettre ASC
                                                            `, [item.id, query.campagne]);

                        if(isDefined(nantissement) && nantissement.length > 0){
                            for(const value of nantissement){
                                const denantissement = await this.connection.query(`SELECT date_denantissement
                                                                                        FROM admin_denantissement
                                                                                        WHERE nantissement_id = $1::uuid
                                                                                        AND campagne_id = $2::uuid
                                                                                    `, [value.id, query.campagne]);

                                        if(isDefined(denantissement) && denantissement.length > 0){
                                            for(const key of denantissement){
                                                 const openDate = new Date(value.date_nantissement);
                                                 const closeDate = new Date(key.date_denantissement);
                                                 dateDenantissement =  this.dateDiff(openDate, closeDate);
                                            }
                                        } else {
                                            const openDate = new Date(value.date_nantissement);
                                            const closeDate = new Date(Date.now());
                                            dateDenantissement = this.dateDiff(openDate, closeDate);
                                        }


                                duree = duree + dateDenantissement;
                                details.push({
                                    numeroLettre : value.numero_lettre,
                                    duree : dateDenantissement
                                });
                            }
                        }

                    result.push({
                        banque: item.libelle,
                        dureeMoy: duree,
                        details : details
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

    async repartitionDecouvertBank(query: any): Promise<any[]> {
        let exception: any, result = [];
        
        try {
          // Get Decouvert
        const financement = await this.connection.query(`SELECT bank.libelle, SUM(solde) as solde
                                                                FROM admin_banques bank
                                                                INNER JOIN admin_compte_exportateurs compte ON compte.banque_id = bank.id
                                                                WHERE compte.campagne_id = $1::uuid
                                                                AND type = $2::admin_compte_exportateurs_type_enum
                                                                GROUP BY bank.id 
                                                                `, [query.campagne, StateTirage.decouvert]);   
                if(isDefined(financement) && financement.length > 0){
                    for (const item of financement){
                        result.push({banque: item.libelle, monant: item.solde})
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

    async repartitionTonnagesNantisBanque(query: any): Promise<any[]> {
        let exception: any, result = [];
        
        try {
            const banque = await this.banqueRepository.find();

            if(isDefined(banque) && banque.length > 0){
                for(const item of banque){
                    // Get Tonnange
                    const tonange = await this.connection.query(`SELECT SUM(poids_net) as poids
                                                                FROM admin_nantissement nantis
                                                                INNER JOIN admin_lots_nantis lotNantis ON lotNantis.nantissement_id = nantis.id
                                                                INNER JOIN admin_lot lot ON lot.id = lotNantis.lot_id
                                                                WHERE nantis.banque_id = $1::uuid
                                                                AND nantis.campagne_id = $2::uuid
                                                                AND lot.validity = $3::boolean
                                                                AND nantis.mode = $4::admin_nantissement_mode_enum                            
                                                                AND lot.mode = $5::admin_lot_mode_enum          
                                                                `, [item.id, query.campagne, true, SoftDelete.active, SoftDelete.active]);  
                                                                
                                                                
                if(isDefined(tonange) && tonange.length > 0){
                    for (const value of tonange){
                        result.push({banque: item.libelle, tonnage: value.poids})
                    }

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

    async tauxUtilisationDecouvert(query: any): Promise<any[]> {
        let exception: any, result = [];
        
        try {
            const banque = await this.banqueRepository.find();

            if(isDefined(banque) && banque.length > 0){
                for(const item of banque){
                    let decouvert = 0; let tirage = 0;
                    const banqueSpec = await this.connection.query(`SELECT AVG(montant)as montant
                                                                        FROM admin_banques_spec
                                                                        WHERE ligne ILIKE $1::text
                                                                        AND banque_id = $2::uuid
                                                                        GROUP BY banque_id
                                                                    `,['%D#%', item.id]);

                    const financement = await this.connection.query(`SELECT SUM(solde) as solde
                                                                    FROM admin_compte_exportateurs
                                                                    WHERE banque_id = $1::uuid
                                                                    AND campagne_id = $2::uuid
                                                                    AND type = $3::admin_compte_exportateurs_type_enum
                                                                    GROUP BY banque_id 
                                                                    `, [item.id, query.campagne, StateTirage.decouvert]);   

                    if(isDefined(banqueSpec) && banqueSpec.length > 0){
                        for (const value of banqueSpec){
                            decouvert = +value.montant;
                        }
    
                    }
                                                                    
                    if(isDefined(financement) && financement.length > 0){
                        for (const key of financement){
                            tirage = +key.solde;
                        }

                    }

                    result.push({
                        banque: item.libelle,
                        ligne: decouvert,
                        tirage: tirage,
                        pourcentage: decouvert > 0 ? ((tirage / decouvert) * 100).toPrecision(2) : 0
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

    async tauxUtilisationNantissement(query: any): Promise<any[]> {
        let exception: any, result = [];
        
        try {
            const banque = await this.banqueRepository.find();

            if(isDefined(banque) && banque.length > 0){
                for(const item of banque){
                    let ligneNantissement = 0; let valeurNanties = 0;
                    const banqueSpec = await this.connection.query(`SELECT AVG(montant)as montant
                                                                        FROM admin_banques_spec
                                                                        WHERE ligne ILIKE $1::text
                                                                        AND banque_id = $2::uuid
                                                                        GROUP BY banque_id
                                                                    `,['%N#%', item.id]);

                    const nantissement = await this.connection.query(`SELECT SUM(montant) as monant
                                                                    FROM admin_nantissement
                                                                    WHERE banque_id = $1::uuid
                                                                    AND campagne_id = $2::uuid
                                                                    `, [item.id, query.campagne]);  

                    if(isDefined(banqueSpec) && banqueSpec.length > 0){
                        for (const value of banqueSpec){
                            ligneNantissement = +value.montant;
                        }
    
                    }
                                                                    
                    if(isDefined(nantissement) && nantissement.length > 0){
                        for (const key of nantissement){
                            valeurNanties = +key.monant;
                        }

                    }
                    const restant = ligneNantissement - valeurNanties;

                    result.push({ 
                        banque: item.libelle,
                        ligne: ligneNantissement,
                        nantissementRestant: restant,
                        pourcentage: ligneNantissement > 0 ? ((restant / ligneNantissement) * 100).toPrecision(2) : 0
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

    dateDiff(date1, date2){
        let tmp = date2 - date1;
     
        tmp = Math.floor(tmp/1000);             // Nombre de secondes entre les 2 dates
        const sec = tmp % 60;                    // Extraction du nombre de secondes
     
        tmp = Math.floor((tmp - sec)/60);    // Nombre de minutes (partie entière)
        const min = tmp % 60;                    // Extraction du nombre de minutes
     
        tmp = Math.floor((tmp - min)/60);    // Nombre d'heures (entières)
        const hour = tmp % 24;                   // Extraction du nombre d'heures
         
        tmp = Math.floor((tmp - hour)/24);   // Nombre de jours restants
        const day = tmp;
         
        return day;
    }
}
