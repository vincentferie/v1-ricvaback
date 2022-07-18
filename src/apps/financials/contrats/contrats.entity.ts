import { CampagneEntity } from "src/apps/configurations/campagne/campagne.entity";
import { GroupementEntity } from "src/apps/configurations/groupement/groupement.entity";
import { IncotemsEntity } from "src/apps/configurations/incotems/incotems.entity";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { BaseEntity, Column, Double, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ClientsEntity } from "../clients/clients.entity";
import { FactureBlEntity } from "../facture-bl/facture-bl.entity";
import { SubContratsEntity } from "../sub-contrats/sub-contrats.entity";
import { FileContratEntity } from "./files-contrats/file-contrat.entity";

@Entity('admin_contrats')
export class ContratsEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'uuid'})
    campagne_id: string;

    @Column({type: 'uuid'})
    client_id: string;

    @Column({type: 'uuid'})
    incotem_id: string;

    @Column({type: 'uuid'})
    groupement_id: string;

    @Column({ type: 'varchar', length: 150, unique: true})
    code: string;

    @Column({ type: 'float'})
    quantity_value: Double;

    @Column({ type: 'float'})
    quantity_percent_min_max: Double;

    @Column({ type: 'float'})
    outturn: Double;

    @Column({ type: 'float'})
    nutcount: Double;

    @Column({ type: 'float'})
    moisture: Double;

    @Column({ type: 'float'})
    foreign_matter: Double;

    @Column({ type: 'float'})
    price: Double;

    @Column({ type: 'varchar', length: 600})
    discount: string;

    @Column({ type: 'varchar', length: 600})
    rejection: string;

    @Column({ type: 'float'})
    payment_deposit: Double;

    @Column({ type: 'float'})
    payment_shipped: Double;

    @Column({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
    signature: Date;

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

    @OneToMany(
        type => SubContratsEntity,
        (subContrats: SubContratsEntity) => subContrats.contrat,
        { nullable: false, primary: true, onUpdate: 'CASCADE'}
    )
    subContrats: SubContratsEntity;

    @ManyToOne(
        type => GroupementEntity,
        (groupement: GroupementEntity) => groupement.contrats,
        { nullable: false, primary: true, onUpdate: 'CASCADE'}
    )
    @JoinColumn({ name: 'groupement_id', referencedColumnName: 'id' })
    groupement: GroupementEntity;

    @ManyToOne(
        type => ClientsEntity,
        (client: ClientsEntity) => client.contrats,
        { nullable: false, primary: true, onUpdate: 'CASCADE'}
    )
    @JoinColumn({ name: 'client_id', referencedColumnName: 'id' })
    client: ClientsEntity;

    @ManyToOne(
        type => IncotemsEntity,
        (incotem: IncotemsEntity) => incotem.contrat,
        { nullable: false, primary: true, onUpdate: 'CASCADE'}
    )
    @JoinColumn({ name: 'incotem_id', referencedColumnName: 'id' })
    incotem: IncotemsEntity;

    @OneToOne(
        type => FileContratEntity,
        (file: FileContratEntity) => file.contrat,
        { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    file: FileContratEntity;

    @OneToMany(
        type => FactureBlEntity,
        (factures: FactureBlEntity) => factures.contrat,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    factures: FactureBlEntity;

    @ManyToOne(
        type => CampagneEntity,
        (campagne: CampagneEntity) => campagne.contrat,
        { nullable: false, primary: true, onUpdate: 'CASCADE'}
    )
    @JoinColumn({ name: 'campagne_id', referencedColumnName: 'id' })
    campagne: CampagneEntity;

}