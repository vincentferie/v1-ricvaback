import { ExportateursGroupementEntity } from "src/apps/configurations/exportateurs-groupement/exportateurs-groupement.entity";
import { ClientsEntity } from "src/apps/financials/clients/clients.entity";
import { TransitairesEntity } from "src/apps/comptabilite/transitaires/transitaires.entity";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ChargesEntity } from "../charges/charges.entity";

@Entity('admin_fournisseurs')
export class FournisseursEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', nullable: true})
    transitaire_id: string;

    @Column({ type: 'uuid', nullable: true})
    client_id: string;

    @Column({ type: 'uuid', nullable: true})
    exportateur_id: string;

    @Column({ type: 'varchar', unique: true, length: 150})
    code: string;

    @Column({ type: 'varchar', unique: true, length: 150})
    raison_social: string;

    @Column({ type: 'varchar'})
    denomination: string;
    
    @Column({type: 'varchar'})
    localisation: string;

    @Column({type: 'varchar'})
    activite: string;

    @Column({type: 'varchar', length: 30, nullable: true})
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

    @OneToOne(
        type => TransitairesEntity,
        (transitaire: TransitairesEntity) => transitaire.fournisTransit,
        { nullable: true, primary: true, onUpdate: 'CASCADE' }
    )
    @JoinColumn({ name: 'transitaire_id', referencedColumnName: 'id' })
    transitaire: TransitairesEntity;

    @OneToOne(
        type => ClientsEntity,
        (client: ClientsEntity) => client.fournisTransit,
        { nullable: true, primary: true, onUpdate: 'CASCADE' }
    )
    @JoinColumn({ name: 'client_id', referencedColumnName: 'id' })
    client: ClientsEntity;

    @OneToOne(
        type => ExportateursGroupementEntity,
        (exportateur: ExportateursGroupementEntity) => exportateur.fournisTransit,
        { nullable: true, primary: true, onUpdate: 'CASCADE' }
    )
    @JoinColumn({ name: 'exportateur_id', referencedColumnName: 'id' })
    exportateur: ExportateursGroupementEntity;

    @OneToMany(
        type => ChargesEntity,
        (charges: ChargesEntity) => charges.fournisseur,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    charges: ChargesEntity[];
}