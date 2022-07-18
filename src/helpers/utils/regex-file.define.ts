import { extname } from "path";

export const imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(new Error('Les fichiers images de type (jpg, jpeg, png) sont autorisées!'), false);
    }
    callback(null, true);
  };

  export const docFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(pdf)$/)) {
      
      return callback(new Error('Les fichiers document de type PDF sont autorisées!'), false);
    }
    callback(null, true);
  };

  export const editFileName = (req, file, callback) => {
    
      const name = file.originalname.replace(/\s/g, "").split('.')[0].toString();
      const extention = extname(file.originalname);
      const randomName = Array(20).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('');

      callback(null, `${name}-${randomName}${extention}`);

  }

  