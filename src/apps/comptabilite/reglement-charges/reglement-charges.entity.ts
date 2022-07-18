import { BanquesEntity } from "src/apps/financials/banques/banques.entity";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { BaseEntity, Column, Double, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ChargesEntity } from "../charges/charges.entity";
import { EcritureChargesEntity } from "../ecriture/charges/ecriture-charges.entity";

@Entity('admin_reglements_charge')
export class ReglementChargesEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({type: 'uuid'})
    charge_id: string;

    @Column({type: 'uuid'})
    banque_id: string;

    @Column({ type: 'bigint'})
    montant: number;

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
        type => ChargesEntity,
        (charge: ChargesEntity) => charge.reglements,
        { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'}
    )
    @JoinColumn({ name: 'charge_id', referencedColumnName: 'id' })
    charge: ChargesEntity;

    @ManyToOne(
        type => BanquesEntity,
        (banque: BanquesEntity) => banque.reglementsCharge,
        { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'}
    )
    @JoinColumn({ name: 'banque_id', referencedColumnName: 'id' })
    banque: BanquesEntity;

    @OneToOne(
        type => EcritureChargesEntity,
        (ecriture: EcritureChargesEntity) => ecriture.reglement,
        { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    ecriture: EcritureChargesEntity;

}