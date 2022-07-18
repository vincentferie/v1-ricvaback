import { EntityRepository, Repository } from "typeorm";
import { AnalysesEntity } from "./analyse.entity";

@EntityRepository(AnalysesEntity)
export class AnalyseRepository extends Repository<AnalysesEntity> { }