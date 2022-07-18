import { EmpotagesEntity } from "src/apps/operations/empotage/empotage.entity";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { BaseEntity, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { FournisseursEntity } from "src/apps/comptabilite/fournisseurs/fournisseurs.entity";
import { TicketRelevageEntity } from "src/apps/operations/ticket-relevage/ticket-relevage.entity";


@Entity('admin_transitaires')
export class TransitairesEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', unique: true, length: 150 })
    raison_social: string;

    @Column({ type: 'varchar' })
    denomination: string;

    @Column({ type: 'varchar' })
    localisation: string;

    @Column({ type: 'varchar', length: 30, nullable: true })
    contact: string;

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
        type => EmpotagesEntity,
        (empotages: EmpotagesEntity) => empotages.transitaire,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    empotages: EmpotagesEntity[];

    @OneToOne(
        type => FournisseursEntity,
        (fournisTransit: FournisseursEntity) => fournisTransit.transitaire,
        { nullable: true, primary: true, onUpdate: 'CASCADE' }
    )
    fournisTransit: FournisseursEntity;

    @OneToMany(
        type => TicketRelevageEntity,
        (ticketRelevages: TicketRelevageEntity) => ticketRelevages.transitaire,
        { nullable: true, primary: true, onUpdate: 'CASCADE' }
    )
    ticketRelevages: TicketRelevageEntity[];
    

}