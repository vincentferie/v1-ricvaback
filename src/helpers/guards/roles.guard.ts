import { Injectable, CanActivate, ExecutionContext, HttpException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import * as jwt from 'jsonwebtoken';
import { isDefined } from 'class-validator';
import { responseRequest } from '../core/response-request';

export const ROLE_KEY = 'role';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // this.reflector.getAll => Select the element as is
    // this.reflector.getAllAndOverride => Select only one element randomly
    // this.reflector.getAllAndMerge => Select All element and merge it on single array
    // We use getAllAndMerge because our config allow multiple roles types

    const requiredRoles = this.reflector.getAllAndMerge<Role[]>(ROLE_KEY, [ 
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      const exception = await responseRequest({
        status: 'unAutorized',
        data: null,
        params: `Aucun rôle n'a été défini. Contactez le service développeur.`
      });
      throw new HttpException(exception[0], exception[1]);
    }
    const request = context.switchToHttp().getRequest<Request>();
    // Read token & decode
    let authorization = request.headers['authorization']; 
    let decodeJwt: any;

      // Stop because token is not exist
      if ((!isDefined(authorization) || !authorization)) {
        const exception = await responseRequest({
            status: 'unAutorized',
            data: null,
            params: `Aucun Jeton n'existe pour la vérification.`
        });
        throw new HttpException(exception[0], exception[1]);
        //return false;
      }
      
      authorization = authorization.slice(7);   // remove Bearer 
  
      if(decodeJwt = jwt.decode(authorization)){
        if(requiredRoles.some((role) => decodeJwt.data.role.libelle?.includes(role))){
          return requiredRoles.some((role) => decodeJwt.data.role.libelle?.includes(role));
        }else{
          const exception = await responseRequest({
              status: 'unAutorized',
              data: null,
              params: `Vous ne disposé pas de privilège d'accès à ce point de terminaison.`
          });
          throw new HttpException(exception[0], exception[1]);
        }
      }else{
          const exception = await responseRequest({
              status: 'unAutorized',
              data: null,
              params: `Impossible de vérifier le Jeton.`
          });
          throw new HttpException(exception[0], exception[1]);
      }
    
  }

}