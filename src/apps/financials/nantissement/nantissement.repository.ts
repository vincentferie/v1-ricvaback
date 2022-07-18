
import { EntityRepository, Repository } from "typeorm";
import { responseRequest } from "src/helpers/core/response-request";
import { HttpException } from "@nestjs/common";
import { isDefined } from "class-validator";
import { NantissementEntity } from "./nantissement.entity";
import { NantissementDto } from "./nantissement.dto";

@EntityRepository(NantissementEntity)
export class NantissementRepository extends Repository<NantissementEntity>{

    // Fonction de save qui sera utiliser pour l'enregistrement simulatané
    async reverseState(inputDto: NantissementDto): Promise<NantissementEntity> {
        const { id, statut} = inputDto;
        const entity = new NantissementEntity();
        let exception, found;
        try {
            
                found =  await this.findOne({id: id});
                    if(isDefined(found)){
                        found.statut = statut;
                        found.updated = new Date(Date.now());
                        await found.save();
                        }
        } catch (error) {
            if (error.code === '23505') {
                // Duplucate 
                exception = await responseRequest({
                    status: 'errorUpdated',
                    data: null,
                    params: error.detail
                });
            } else if (error.code === '22001') {
                exception = await responseRequest({
                    status: 'errorPayload',
                    data: null,
                    params: `${error.length} mots saisies excèdent la limite de taille autorisée.`
                });
            } else {
                exception = await responseRequest({
                    status: 'errorOtherRequest',
                    data: null,
                    params: error[0].constraints
                });
            }

            throw new HttpException(exception[0], exception[1]);
        }
        return found;
    }

}
