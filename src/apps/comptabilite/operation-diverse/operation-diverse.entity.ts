import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { BaseEntity, Column, Entity, Index, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { EcritureChargesDiversesEntity } from "../ecriture/divers/ecriture-charges-ops.entity";
import { ReglementOperationDiverseEntity } from "../reglement-operation-diverse/reglement-operation-diverse.entity";

@Entity('admin_charges_diverse')
@Index("index_ordre_facture_ops", ['num_ordre', 'num_facture'], { unique: true })
export class OperationDiverseEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 150})
    num_ordre: string;

    @Column({ type: 'varchar', length: 150})
    num_facture: string;

    @Column({ type: 'varchar', length: 150})
    libelle: string;

    @Column({ type: 'varchar', length: 300})
    description: string;
    
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

    @OneToOne(
        type => EcritureChargesDiversesEntity,
        (ecriture: EcritureChargesDiversesEntity) => ecriture.charge,
        { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    ecriture: EcritureChargesDiversesEntity;

    @OneToMany(
        type => ReglementOperationDiverseEntity,
        (reglements: ReglementOperationDiverseEntity) => reglements.charge,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    reglements: ReglementOperationDiverseEntity[];
}