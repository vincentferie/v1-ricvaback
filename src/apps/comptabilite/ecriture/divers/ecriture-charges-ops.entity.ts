import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { OperationDiverseEntity } from "../../operation-diverse/operation-diverse.entity";
import { ReglementOperationDiverseEntity } from "../../reglement-operation-diverse/reglement-operation-diverse.entity";

@Entity('admin_ecriture_charges_diverses')
export class EcritureChargesDiversesEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', nullable: true})
    charge_ops_id: string;

    @Column({ type: 'uuid', nullable: true})
    reglement_ops_charge_id: string;

    @Column({type: 'int'})
    debit: number;

    @Column({type: 'int'})
    credit: number;

    @Column({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
    created: Date;

    @Column({  type: 'timestamp without time zone', nullable: true })
    updated: Date;

    @Column({ type: 'enum', enum: SoftDelete, default: SoftDelete.active })
    mode: SoftDelete;

    @OneToOne(
        type => OperationDiverseEntity,
        (charge: OperationDiverseEntity) => charge.ecriture,
        { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'}
    )
    @JoinColumn({ name: 'charge_ops_id', referencedColumnName: 'id' })
    charge: OperationDiverseEntity;

    @OneToOne(
        type => ReglementOperationDiverseEntity,
        (reglement: ReglementOperationDiverseEntity) => reglement.ecriture,
        { nullable: true, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'}
    )
    @JoinColumn({ name: 'reglement_ops_charge_id', referencedColumnName: 'id' })
    reglement: ReglementOperationDiverseEntity;

}