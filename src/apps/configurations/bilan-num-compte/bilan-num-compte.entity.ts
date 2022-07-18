import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BilanDataParamsEntity } from "../bilan-data-params/bilan-data-params.entity";
@Entity('admin_bilan_compte_params')
export class BilanCompteParamsEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({ type: 'uuid' })
    bilan_data_params_id: string;

    @Column({ type: 'int' })
    numero: number;

    @Column({ type: 'varchar', length: 4, nullable: true })
    type: string;

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
        type => BilanDataParamsEntity,
        (dataParams: BilanDataParamsEntity) => dataParams.compte,
        { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'}
    )
    @JoinColumn({ name: 'bilan_data_params_id', referencedColumnName: 'id' })
    dataParams: BilanDataParamsEntity;
}