import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, BaseEntity, OneToOne } from 'typeorm';
import { DetailBlEntity } from '../bon-livraison/details-bl/detail-bl.entity';
import { ConteneurEntity } from '../conteneur/conteneur.entity';
import { EmpotagesEntity } from '../empotage/empotage.entity';
import { TicketRelevageEntity } from '../ticket-relevage/ticket-relevage.entity';

@Entity('admin_plomb_conteneur')
export class PlombEntity extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    empotage_id: string;
    
    @Column({ type: 'uuid' })
    conteneur_id: string;

    @Column({ type: 'varchar', length: 150 })
    pb_lettre: string;

    @Column({ type: 'int' })
    pb_chiffre: number;

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
        type => EmpotagesEntity,
        (empotage: EmpotagesEntity) => empotage.plombs,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    @JoinColumn({ name: 'empotage_id', referencedColumnName: 'id' })
    empotage: EmpotagesEntity;

    @OneToOne(
        type => ConteneurEntity,
        (conteneur: ConteneurEntity) => conteneur.plomb,
        { nullable: false, primary: true, onUpdate: 'CASCADE'}
    )
    @JoinColumn({ name: 'conteneur_id', referencedColumnName: 'id' })
    conteneur: ConteneurEntity;

    @OneToOne(
        type => TicketRelevageEntity,
        (ticketRelevage: TicketRelevageEntity) => ticketRelevage.plomb,
        { nullable: false, primary: true, onDelete: 'NO ACTION', onUpdate: 'CASCADE' }
    )
    ticketRelevage: TicketRelevageEntity;

    @OneToOne(
        type => DetailBlEntity,
        (detailBl: DetailBlEntity) => detailBl.plomb,
        { nullable: false, primary: true, onDelete: 'NO ACTION', onUpdate: 'CASCADE' }
    )
    detailBl: DetailBlEntity;

}