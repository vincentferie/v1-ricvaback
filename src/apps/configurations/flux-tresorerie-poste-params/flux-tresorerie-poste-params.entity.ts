import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { FluxTresorerieParamsEntity } from "../flux-tresorerie-params/flux-tresorerie-params.entity";

@Entity('admin_flux_tresorerie_poste_params')
export class FluxTresoreriePosteParamsEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    flux_tresorerie_params_id: string;

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
        type => FluxTresorerieParamsEntity,
        (compte: FluxTresorerieParamsEntity) => compte.poste,
        { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'}
    )
    @JoinColumn({ name: 'flux_tresorerie_params_id', referencedColumnName: 'id' })
    compte: FluxTresorerieParamsEntity;

}