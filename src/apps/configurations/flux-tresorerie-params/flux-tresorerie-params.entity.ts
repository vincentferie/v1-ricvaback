import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { FluxTresoreriePosteParamsEntity } from "../flux-tresorerie-poste-params/flux-tresorerie-poste-params.entity";

@Entity('admin_flux_tresorerie_params')
export class FluxTresorerieParamsEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 2, nullable: true })
    ref: string;

    @Column({ type: 'varchar', length: 150 })
    libelle: string;

    @Column({ type: 'smallint' })
    ordre: number;

    @Column({ type: 'boolean' })
    total: boolean;

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

    @OneToMany(
        type => FluxTresoreriePosteParamsEntity,
        (poste: FluxTresoreriePosteParamsEntity) => poste.compte,
        { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    poste: FluxTresoreriePosteParamsEntity[];

}