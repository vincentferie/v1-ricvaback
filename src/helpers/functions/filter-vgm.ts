import { camelize } from "./camelize";

export const HtmlTableToJson = require('html-table-to-json');

/** Format VGM
 * return JSON or Object
 */
export function filterVgm(html: string, query: string) {
    let result;
    const jsonTables = HtmlTableToJson.parse(html); // Convertir un HTML en JSON

    if(html.includes('VGM TRANSMIS')){
        const array = groupByFunction(jsonTables.results, 'VGM TRANSMIS', '');
        let i = 0;
        let arrayClean = [];
        for (const [key, value] of Object.entries(array)) {
            if(i<7){
                const valueCleanUp = (value[0]['2'].includes('Kg') === true) ? +value[0]['2'].replace(' ', '').replace('Kg', '') : value[0]['2']; // Convertir le kg en valeur numerique
                const keyCleanUp = camelize(key.replace(':', '').replace('N°', '').replace('é', 'e').replace("d'", '').replace(/[\s]$/,"").replace(/^[\s]/, "").toLowerCase()); // Camelize string : puis l'espace a la fin du texte

                arrayClean[keyCleanUp] = valueCleanUp;
                arrayClean['statut'] = true;
            }
            i++; // L'information à la ligne n°7 n'est pas importante
        }
        result = {...arrayClean};

    }else if(html.includes('VGM NON TRANSMIS')){
        result = {
            conteneur: query, 
            booking: null,
            ligneMaritime: null,
            vgmCertifie: 0,
            pontBascule: null,
            dateEdition: null,
            dateEmission: null,
            statut: false
        };
    }
    return result;
}

/** Function for Group json by key
 * return JSON or Object
 */
function groupByFunction(objet, keyGroup, filter){

    const groupBy = keys => array =>
    array.reduce((objectsByKeyValue, obj) => {
            const value = keys.map(key => obj[key]).join('-');
            objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
            return objectsByKeyValue;
        }, {});
    const groupByData = groupBy([keyGroup]);
    if(filter == ''){
        const levelOneGroup = groupByData(objet);
        return groupByData(levelOneGroup[filter]);
    }else{
        return groupByData;
    }
}