import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from "typeorm";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { DetailsSpeculationEntity } from "../details-speculation/detail-speculation.entity";
import { TicketRelevageEntity } from "src/apps/operations/ticket-relevage/ticket-relevage.entity";
import { CampagneEntity } from "../campagne/campagne.entity";
import { ChargementEntity } from "src/apps/operations/chargements/chargement.entity";
import { LotEntity } from "src/apps/operations/lots/lot.entity";

@Entity('admin_speculation')
export class SpeculationEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 150, unique: true })
    libelle: string;

    @Column({ type: 'boolean', nullable: false })
    usinage: boolean;

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
        type => CampagneEntity,
        (campagne: CampagneEntity) => campagne.speculation,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    campagne: CampagneEntity[];

    @OneToOne(
        type => DetailsSpeculationEntity,
        (detailsSpecultation: DetailsSpeculationEntity) => detailsSpecultation.speculation,
        { nullable: false, primary: true, onUpdate: 'CASCADE'}
    )
    detailsSpeculation: DetailsSpeculationEntity;

    @OneToMany(
        type => ChargementEntity,
        (chargement: ChargementEntity) => chargement.speculation,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    chargement: ChargementEntity[];

    @OneToMany(
        type => LotEntity,
        (lots: LotEntity) => lots.speculation,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    lots: LotEntity[];

    @OneToMany(
        type => TicketRelevageEntity,
        (ticketRelevages: TicketRelevageEntity) => ticketRelevages.speculation,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    ticketRelevages: TicketRelevageEntity[];
    
}