import { DetailsSpeculationEntity } from "./detail-speculation.entity";
import { EntityRepository, Repository } from "typeorm";
import { DetailsSpeculationDto } from "./detail-speculation.dto";
import { responseRequest } from "src/helpers/core/response-request";
import { HttpException } from "@nestjs/common";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";

@EntityRepository(DetailsSpeculationEntity)
export class DetailsSpeculationRepository extends Repository<DetailsSpeculationEntity>{

    // Fonction de save qui sera utiliser pour l'enregistrement simulatané
    async createDetail(detailSpeculationDto: DetailsSpeculationDto): Promise<DetailsSpeculationEntity> {
        const { speculation_id, poids_sac, nbr_sac, unite, created_by } = detailSpeculationDto;
        const detailSpeculation = new DetailsSpeculationEntity();
        let exception;

        detailSpeculation.speculation_id = speculation_id;
        detailSpeculation.poids_sac = poids_sac;
        detailSpeculation.nbr_sac = nbr_sac;
        detailSpeculation.unite = unite;
        detailSpeculation.created = new Date(Date.now());
        detailSpeculation.created_by = created_by;
        detailSpeculation.mode = SoftDelete.active;

        try {
            await detailSpeculation.save();
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

        return detailSpeculation;
    }
}
