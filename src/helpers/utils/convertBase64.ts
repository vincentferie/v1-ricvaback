import { writeFileSync } from 'fs';
const mime = require('mime');

export const convertBase64 = async (file: string, name: string, path: string) => {
        // Remove header
        const matches = file.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches.length !== 3) {
            throw new Error('Invalid base64 string');
        }
        const randomName = Array(20).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('')
        const extension = mime.extension(matches[1]);
        try {
            if(extension.includes('pdf') || extension.includes('png') || extension.includes('jpg') || extension.includes('jpeg')){
                const data = Buffer.from(matches[2], 'base64');
           
                if((2097152 / 1e+6) >= (data.length / 1e+6)){ // 2.097152 MB
                    let fileName = `${name.replace(/\s/g, "").toLowerCase()}-${randomName}.${extension}`;
                    writeFileSync(`${path}${fileName}`, data, {encoding: 'utf8'});
                    return {filename: fileName, path: `${path}${fileName}`};
                }else{
                    throw new Error(`La taille d'un fichier autorisé est de 2.097152 MB`);
                }
            } 
        } catch (e) {
            throw new Error(`Impossible de traiter le fichier : ${e}`);
        }
}