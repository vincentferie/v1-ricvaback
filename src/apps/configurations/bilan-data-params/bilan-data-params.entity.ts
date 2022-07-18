import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BilanCompteParamsEntity } from "../bilan-num-compte/bilan-num-compte.entity";
import { BilanParamsEntity } from "../bilan-params/bilan-params.entity";

@Entity('admin_bilan_data_params')
export class BilanDataParamsEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'uuid'})
    bilan_params_id: string;

    @Column({ type: 'varchar', length: 5})
    ref: string;

    @Column({ type: 'varchar', length: 255})
    libelle: string;

    @Column({type: 'boolean', default: false})
    total: boolean;

    @Column({ type: 'smallint'})
    ordre: number;

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
        type => BilanParamsEntity,
        (bilan: BilanParamsEntity) => bilan.bilanData,
        { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'}
    )
    @JoinColumn({ name: 'bilan_params_id', referencedColumnName: 'id' })
    bilan: BilanParamsEntity;

    @OneToMany(
        type => BilanCompteParamsEntity,
        (compte: BilanCompteParamsEntity) => compte.dataParams,
        { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    compte: BilanCompteParamsEntity[];

}