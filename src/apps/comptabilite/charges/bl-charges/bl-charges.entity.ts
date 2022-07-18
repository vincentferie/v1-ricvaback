import { SiteEntity } from "src/apps/configurations/sites/site.entity";
import { BonLivraisonEntity } from "src/apps/operations/bon-livraison/bon-livraison.entity";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ChargesEntity } from "../charges.entity";

@Entity('admin_charge_bl')
export class ChargeBlEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid'})
    charge_id: string;

    @Column({ type: 'uuid'})
    site_id: string;

    @Column({ type: 'uuid'})
    bl_id: string;

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
        type => ChargesEntity,
        (charge: ChargesEntity) => charge.blCharge,
        { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'}
    )
    @JoinColumn({ name: 'charge_id', referencedColumnName: 'id' })
    charge: ChargesEntity;

    @ManyToOne(
        type => BonLivraisonEntity,
        (billOfLanding: BonLivraisonEntity) => billOfLanding.charges,
        { nullable: false, primary: true, onUpdate: 'CASCADE'}
    )
    @JoinColumn({ name: 'bl_id', referencedColumnName: 'id' })
    billOfLanding: BonLivraisonEntity;

    @ManyToOne(
        type => SiteEntity,
        (site: SiteEntity) => site.chargeBl,
        { nullable: false, primary: true, onUpdate: 'CASCADE'}
    )
    @JoinColumn({ name: 'site_id', referencedColumnName: 'id' })
    site: SiteEntity;




}