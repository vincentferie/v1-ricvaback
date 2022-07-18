import { CampagneEntity } from "src/apps/configurations/campagne/campagne.entity";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { BaseEntity, Column, Double, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BanquesEntity } from "../banques/banques.entity";
import { FactureBlEntity } from "../facture-bl/facture-bl.entity";

@Entity('admin_reglements_factures_bl')
export class ReglementsFactureBlEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'uuid'})
    campagne_id: string;
    
    @Column({type: 'uuid'})
    facture_bl_id: string;

    @Column({type: 'uuid'})
    banque_id: string;

    @Column({ type: 'varchar', length: 10})
    currency: string;

    @Column({ type: 'float'})
    currency_value: Double;

    @Column({ type: 'float'})
    amount: Double;

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
        type => FactureBlEntity,
        (facture: FactureBlEntity) => facture.reglements,
        { nullable: false, primary: true, onUpdate: 'CASCADE',}
    )
    @JoinColumn({ name: 'facture_bl_id', referencedColumnName: 'id' })
    facture: FactureBlEntity;

    @ManyToOne(
        type => BanquesEntity,
        (banque: BanquesEntity) => banque.reglements,
        { nullable: false, primary: true, onUpdate: 'CASCADE'}
    )
    @JoinColumn({ name: 'banque_id', referencedColumnName: 'id' })
    banque: BanquesEntity;

    @ManyToOne(
        type => CampagneEntity,
        (campagne: CampagneEntity) => campagne.reglementFactureBl,
        { nullable: false, primary: true, onUpdate: 'CASCADE'}
    )
    @JoinColumn({ name: 'campagne_id', referencedColumnName: 'id' })
    campagne: CampagneEntity;

}