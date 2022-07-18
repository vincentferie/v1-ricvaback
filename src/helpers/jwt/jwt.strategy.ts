import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { HttpException, Injectable } from '@nestjs/common';
import { JwtPayload } from './jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { isDefined } from 'class-validator';
import { responseRequest } from '../core/response-request';
import * as jwt from 'jsonwebtoken';
import { AccountRepository } from 'src/apps/configurations/account/account.repository';
import { AccountEntity } from 'src/apps/configurations/account/account.entity';
import { jwtConst } from '../constant/jwt.define';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(AccountRepository) private readonly accountRepository: AccountRepository
    ) {
        super({
            jwtFromRequest      : ExtractJwt.fromAuthHeaderAsBearerToken(),
            passReqToCallback   : true,
            ignoreExpiration    : true,
            secretOrKey         : jwtConst.secret,
        });
    }

    async validate(req: Request, payload: JwtPayload): Promise<AccountEntity> {
        const jwtToken = req.headers['authorization'].slice(7);
        jwt.verify(jwtToken, jwtConst.secret, async function(err, decoded) {
                            if (err) {
                                let exception;
                                if(err.name  === 'TokenExpiredError'){
                                    exception = await responseRequest({
                                        status: 'unAutorized',
                                        data: 'Since '+err.expiredAt,
                                        params: err.message
                                    });
                                }else if(err.name = 'JsonWebTokenError'){
                                    exception = await responseRequest({
                                        status: 'unAutorized',
                                        data: null,
                                        params: err.message
                                    });
                                } else if(err.name === 'NotBeforeError'){
                                    exception = await responseRequest({
                                        status: 'unAutorized',
                                        data: 'This current date '+err.date +' is before the nbf claim',
                                        params: err.message
                                    });
                                }else {
                                    exception = await responseRequest({
                                        status: 'unAutorized',
                                        data: err,
                                        params: 'Imposible to read this token. Contact Dev team.'
                                    });
                                }
                                throw new HttpException(exception[0], exception[1]);
                            }
                            if (decoded) {
                                return true;
                            } else {
                                return false;
                            }
                        });

        const { id } = payload.data;
        const user = await this.accountRepository.findOne({ id });

        if (!isDefined(user)) {
            const exception = await responseRequest({
                status: 'unAutorized',
                data: null,
                params: `L'utilisateur n'existe pas en base.`
            });
            throw new HttpException(exception[0], exception[1]);
        }
        return user;
    }
}