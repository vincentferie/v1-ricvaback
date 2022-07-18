import { RubriquesChargesEntity } from "src/apps/configurations/rubrique-charges/rubrique-charges.entity";
import { TypeChargesEntity } from "src/apps/configurations/type-charges/type-charges.entity";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { BaseEntity, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { EcritureChargesEntity } from "../ecriture/charges/ecriture-charges.entity";
import { FournisseursEntity } from "../fournisseurs/fournisseurs.entity";
import { ReglementChargesEntity } from "../reglement-charges/reglement-charges.entity";
import { ChargeBlEntity } from "./bl-charges/bl-charges.entity";


@Entity('admin_charges')
@Index("index_ordre_facture", ['num_ordre', 'num_facture'], { unique: true })
export class ChargesEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid'})
    fournisseur_id: string;

    @Column({ type: 'uuid'})
    type_charge_id: string;

    @Column({ type: 'uuid'})
    rubrique_charge_id: string;

    @Column({ type: 'varchar', length: 150})
    num_ordre: string;

    @Column({ type: 'varchar', length: 150})
    num_facture: string;

    @Column({ type: 'varchar', length: 150})
    libelle: string;
    
    @Column({type: 'bigint'})
    montant_ht: number;

    @Column({type: 'bigint'})
    montant_tva: number;

    @Column({ type: 'timestamp without time zone'})
    date_facture: Date;

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
        type => FournisseursEntity,
        (fournisseur: FournisseursEntity) => fournisseur.charges,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    @JoinColumn({ name: 'fournisseur_id', referencedColumnName: 'id' })
    fournisseur: FournisseursEntity;

    @ManyToOne(
        type => TypeChargesEntity,
        (typeCharge: TypeChargesEntity) => typeCharge.charges,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    @JoinColumn({ name: 'type_charge_id', referencedColumnName: 'id' })
    typeCharge: TypeChargesEntity;

    @ManyToOne(
        type => RubriquesChargesEntity,
        (rubrique: RubriquesChargesEntity) => rubrique.charges,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    @JoinColumn({ name: 'rubrique_charge_id', referencedColumnName: 'id' })
    rubrique: RubriquesChargesEntity;
    
    @OneToOne(
        type => ChargeBlEntity,
        (blCharge: ChargeBlEntity) => blCharge.charge,
        { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    blCharge: ChargeBlEntity;

    @OneToOne(
        type => EcritureChargesEntity,
        (ecriture: EcritureChargesEntity) => ecriture.charge,
        { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    ecriture: EcritureChargesEntity;

    @OneToMany(
        type => ReglementChargesEntity,
        (reglements: ReglementChargesEntity) => reglements.charge,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    reglements: ReglementChargesEntity[];
}