import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { EcritureChargesDiversesEntity } from "../ecriture/divers/ecriture-charges-ops.entity";
import { OperationDiverseEntity } from "../operation-diverse/operation-diverse.entity";

@Entity('admin_reglements_charge_diverse')
export class ReglementOperationDiverseEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({type: 'uuid'})
    charge_ops_id: string;

    @Column({ type: 'bigint'})
    montant: number;

    @Column({ type: 'varchar', length: 300, nullable: true})
    description: string;

    @Column({ type: 'timestamp without time zone' })
    date_reglement: Date;
    
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
        type => OperationDiverseEntity,
        (charge: OperationDiverseEntity) => charge.reglements,
        { nullable: false, primary: true, onUpdate: 'CASCADE'}
    )
    @JoinColumn({ name: 'charge_ops_id', referencedColumnName: 'id' })
    charge: OperationDiverseEntity;

    @OneToOne(
        type => EcritureChargesDiversesEntity,
        (ecriture: EcritureChargesDiversesEntity) => ecriture.reglement,
        { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    ecriture: EcritureChargesDiversesEntity;
}