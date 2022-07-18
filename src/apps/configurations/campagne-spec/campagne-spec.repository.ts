
import { EntityRepository, Repository } from "typeorm";
import { responseRequest } from "src/helpers/core/response-request";
import { HttpException } from "@nestjs/common";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { CampagneSpecEntity } from "./campagne-spec.entity";
import { CampagneSpecDto } from "./campagne-spec.dto";

@EntityRepository(CampagneSpecEntity)
export class CampagneSpecRepository extends Repository<CampagneSpecEntity>{
    // Fonction de save qui sera utiliser pour l'enregistrement simulatané
    async createDetail(detailDto: CampagneSpecDto): Promise<CampagneSpecEntity> {
        const { campagne_id, libelle, valeur, tag, created, created_by } = detailDto;
        const details = new CampagneSpecEntity();
        let exception;

        details.campagne_id = campagne_id;
        details.libelle = libelle;
        details.valeur = valeur;
        details.tag = tag;
        details.created = created;
        details.created_by = created_by;
        details.mode = SoftDelete.active;

        try {
            await details.save();
        } catch (error) {
            
            if (error.code === '23505') {
                // Duplucate 
                exception = await responseRequest({
                    status: 'errorInserted',
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

        return details;

    }
}