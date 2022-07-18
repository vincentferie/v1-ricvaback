import { IncotemsEntity } from "src/apps/configurations/incotems/incotems.entity";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { BaseEntity, Column, Double, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ClientsEntity } from "../clients/clients.entity";
import { ContratsEntity } from "../contrats/contrats.entity";
import {SubFileContratsEntity } from "./sub-files-contrats/sub-file-contrat.entity";

@Entity('admin_sous_contrats')
export class SubContratsEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'uuid'})
    contrat_id: string;

    @Column({type: 'uuid'})
    incotem_id: string;

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

    @ManyToOne(
        type => ContratsEntity,
        (contrat: ContratsEntity) => contrat.subContrats,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    @JoinColumn({ name: 'contrat_id', referencedColumnName: 'id' })
    contrat: ContratsEntity;

    @OneToOne(
        type => IncotemsEntity,
        (incotem: IncotemsEntity) => incotem.contrat,
        { nullable: false, primary: true, onUpdate: 'CASCADE', }
    )
    @JoinColumn({ name: 'incotem_id', referencedColumnName: 'id' })
    incotem: IncotemsEntity;

    @OneToOne(
        type => SubFileContratsEntity,
        (file: SubFileContratsEntity) => file.contrat,
        { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'}
    )
    file: SubFileContratsEntity;
}