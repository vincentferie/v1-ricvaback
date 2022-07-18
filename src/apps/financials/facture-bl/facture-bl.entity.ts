import { CampagneEntity } from "src/apps/configurations/campagne/campagne.entity";
import { BonLivraisonEntity } from "src/apps/operations/bon-livraison/bon-livraison.entity";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { BaseEntity, Column, Double, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ClientsEntity } from "../clients/clients.entity";
import { ContratsEntity } from "../contrats/contrats.entity";
import { ReglementsFactureBlEntity } from "../reglement-factures-bl/reglement-factures-bl.entity";
import { FileFactureBlEntity } from "./files-factures-bl/file-factures.entity";

@Entity('admin_facture_bl')
@Index("index_contrat_bl", ['contrat_id', 'bl_id'], { unique: true })
export class FactureBlEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'uuid'})
    campagne_id: string;

    @Column({type: 'uuid'})
    client_id: string;

    @Column({type: 'uuid'})
    contrat_id: string;

    @Column({type: 'uuid'})
    bl_id: string;

    @Column({ type: 'varchar', length: 150, unique: true})
    invoice: string;

    @Column({ type: 'varchar', length: 250})
    port_load: string;

    @Column({ type: 'varchar', length: 250})
    port_discharge: string;
    
    @Column({ type: 'int'})
    total_container: number;

    @Column({ type: 'int'})
    total_bags: number;

    @Column({ type: 'int'})
    gross_weight: number;

    @Column({ type: 'int'})
    net_weight: number;
    
    @Column({ type: 'float'})
    qty_mts: Double;
    
    @Column({ type: 'float'})
    unit_price: Double;
        
    @Column({ type: 'float'})
    amount: Double;
            
    @Column({ type: 'float'})
    amount_chargeable_percent: Double;
            
    @Column({ type: 'float'})
    amount_chargeable: Double;
    
    @Column({ type: 'timestamp without time zone' })
    date_contrat: Date;
    
    @Column({ type: 'timestamp without time zone' })
    date_invoice: Date;

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
        type => BonLivraisonEntity,
        (billOfLanding: BonLivraisonEntity) => billOfLanding.factures,
        { nullable: false, primary: true, onUpdate: 'CASCADE'}
    )
    @JoinColumn({ name: 'bl_id', referencedColumnName: 'id' })
    billOfLanding: BonLivraisonEntity;

    @ManyToOne(
        type => ContratsEntity,
        (contrat: ContratsEntity) => contrat.factures,
        { nullable: false, primary: true, onUpdate: 'CASCADE'}
    )
    @JoinColumn({ name: 'contrat_id', referencedColumnName: 'id' })
    contrat: ContratsEntity;

    @ManyToOne(
        type => ClientsEntity,
        (client: ClientsEntity) => client.factures,
        { nullable: false, primary: true, onUpdate: 'CASCADE'}
    )
    @JoinColumn({ name: 'client_id', referencedColumnName: 'id' })
    client: ClientsEntity;

    @OneToOne(
        type => FileFactureBlEntity,
        (file: FileFactureBlEntity) => file.facture,
        { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'}
    )
    file: FileFactureBlEntity;

    @OneToMany(
        type => ReglementsFactureBlEntity,
        (reglements: ReglementsFactureBlEntity) => reglements.facture,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    reglements: ReglementsFactureBlEntity[];

    @ManyToOne(
        type => CampagneEntity,
        (campagne: CampagneEntity) => campagne.factureBl,
        { nullable: false, primary: true, onUpdate: 'CASCADE'}
    )
    @JoinColumn({ name: 'campagne_id', referencedColumnName: 'id' })
    campagne: CampagneEntity;


}