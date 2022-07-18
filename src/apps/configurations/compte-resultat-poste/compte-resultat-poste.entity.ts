import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { CompteResultatParamsEntity } from "../compte-resultat-params/compte-resultat-params.entity";

@Entity('admin_compte_resultat_poste')
export class CompteResultatPosteEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    compte_result_params_id: string;

    @Column({ type: 'int' })
    numero: number;

    @Column({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
    created: Date;
  
    @Column({ type: 'varchar', length: 150 })
    created_by: string;
  
    @Column({ type: 'timestamp without time zone', nullable: true })
    updated: Date;
  
    @Column({ type: 'varchar', length: 150, nullable: true })
    updated_by: string;

    @Column({ type: 'enum', enum: SoftDelete, default: SoftDelete.active })
    mode: SoftDelete;

    @ManyToOne(
        type => CompteResultatParamsEntity,
        (compte: CompteResultatParamsEntity) => compte.poste,
        { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'}
    )
    @JoinColumn({ name: 'compte_result_params_id', referencedColumnName: 'id' })
    compte: CompteResultatParamsEntity;
    
}