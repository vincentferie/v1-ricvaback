import { EntityRepository, Repository } from "typeorm";
import { CompteComptableOneEntity } from "./compte-compta-one.entity";

@EntityRepository(CompteComptableOneEntity)
export class CompteComptableOneRepository extends Repository<CompteComptableOneEntity> {
}