import { readFile } from 'fs';

export const fileRead = async (path: string, file:string): Promise<Buffer> => {
    
    const pdf = await new Promise<Buffer>((resolve, reject) => {
        readFile(path+'/'+file, {}, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
    return pdf;
}