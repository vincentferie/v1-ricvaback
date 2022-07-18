import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { isDefined } from "class-validator";

export const JwtInfoGetter = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): any => {
        let info: object;
        const request = ctx.switchToHttp().getRequest();

        if(isDefined(request.authInfo)){
            info = {
                auth: request.authInfo,
                user: request.user
            };
        } else {
            info = {
                user: request.user,
            };
        }
        return info;
    },
);