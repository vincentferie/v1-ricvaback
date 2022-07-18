import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ChargesEntity } from "../../charges/charges.entity";
import { ReglementChargesEntity } from "../../reglement-charges/reglement-charges.entity";

@Entity('admin_ecriture_charges')
export class EcritureChargesEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', nullable: true})
    charge_id: string;

    @Column({ type: 'uuid', nullable: true})
    reglement_charge_id: string;

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
        type => ChargesEntity,
        (charge: ChargesEntity) => charge.ecriture,
        { nullable: false, primary: true, onUpdate: 'CASCADE'}
    )
    @JoinColumn({ name: 'charge_id', referencedColumnName: 'id' })
    charge: ChargesEntity;

    @OneToOne(
        type => ReglementChargesEntity,
        (reglement: ReglementChargesEntity) => reglement.ecriture,
        { nullable: true, primary: true, onUpdate: 'CASCADE'}
    )
    @JoinColumn({ name: 'reglement_charge_id', referencedColumnName: 'id' })
    reglement: ReglementChargesEntity;


}