import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BaseEntity, OneToOne } from 'typeorm';
import { CampagneEntity } from '../../configurations/campagne/campagne.entity';
import { PlombEntity } from '../plomb/plomb.entity';
import { BookingEntity } from '../booking/booking.entity';
import { ConteneurEntity } from '../conteneur/conteneur.entity';
import { GroupementEntity } from 'src/apps/configurations/groupement/groupement.entity';
import { SpeculationEntity } from 'src/apps/configurations/speculations/speculation.entity';
import { TransitairesEntity } from 'src/apps/comptabilite/transitaires/transitaires.entity';
import { FileTicketRelevageEntity } from './file-ticket/file-ticket-relevage.entity';
@Entity('admin_ticket_relevage')
export class TicketRelevageEntity extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  exportateur_id: string;

  @Column({ type: 'uuid' })
  campagne_id: string;

  @Column({ type: 'uuid' })
  speculation_id: string;

  @Column({ type: 'uuid' })
  booking_id: string;
  
  @Column({ type: 'uuid' })
  conteneur_id: string;
  
  @Column({ type: 'uuid' })
  plomb_id: string;

  @Column({ type: 'uuid' })
  transitaire_id: string;
  
  @Column({ type: 'varchar', length: 100 })
  code_pesee: string;

  @Column({ type: 'varchar', length: 100 })
  booking_ticket: string;

  @Column({ type: 'varchar', length: 150 })
  compagnie_maritime: string;

  @Column({ type: 'int'})
  first_weighing: number;

  @Column({type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
  date_first_weighing: Date;

  @Column({type: 'time'})
  hour_first_weighing: string;

  @Column({ type: 'int'})
  second_weighing: number;

  @Column({type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
  date_second_weighing: Date;

  @Column({type: 'time'})
  hour_second_weighing: string;

  @Column({type: 'int', default: 0})
  poids_declare: number;

  @Column({type: 'int', default: 0})
  poids_net: number;

  @Column({type: 'int', default: 0})
  poids_vgm: number;

  @Column({type: 'int', default: 0})
  nbr_emb: number;

  @Column({type: 'int', default: 0})
  tare_emb: number;

  @Column({type: 'int', default: 0})
  tare_pal: number;

  @Column({type: 'int', default: 0})
  tare_cnt: number;

  @Column({type: 'int', default: 0})
  tare_hab: number;

  @Column({type: 'int', default: 0})
  tare_cnt2: number;

  @Column({ type: 'varchar', length: 10})
  metode_controle_vgm: string;

  @Column({ type: 'varchar', length: 150})
  provenance: string;

  @Column({ type: 'varchar', length: 150})
  destination: string;

  @Column({ type: 'varchar', length: 150})
  chauffeur: string;

  @Column({ type: 'varchar', length: 150})
  navire: string;

  @Column({ type: 'varchar', length: 150})
  port_embarquement: string;

  @Column({ type: 'varchar', length: 150})
  destination_navire: string;

  @Column({ type: 'varchar', length: 150})
  magazin: string;

  @Column({ type: 'varchar', nullable: true, length: 150})
  num_contrat: string;
  
  @Column({ type: 'varchar', nullable: true, length: 150})
  num_connaissement: string;
  
  @Column({ type: 'varchar', nullable: true, length: 150})
  num_lot: string;
  
  @Column({ type: 'varchar', nullable: true, length: 150})
  num_livraison: string;
  
  @Column({ type: 'varchar', nullable: true, length: 150})
  num_dossier: string;
  
  @Column({ type: 'varchar', nullable: true, length: 150})
  num_bord: string;

  @Column({ type: 'varchar', length: 150})
  tracteur: string;
  
  @Column({ type: 'varchar', length: 150})
  remorque: string;

  @Column({ type: 'varchar', length: 150})
  peseur: string;

  @Column({ type: 'varchar', length: 150})
  agent_cci: string;

  @Column({ type: 'boolean', default: false})
  validity: boolean;

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
    type => CampagneEntity,
    (campagne: CampagneEntity) => campagne.ticketRelevages,
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  @JoinColumn({ name: 'campagne_id', referencedColumnName: 'id' })
  campagne: CampagneEntity;

  @ManyToOne(
    type => SpeculationEntity,
    (speculation: SpeculationEntity) => speculation.ticketRelevages,
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  @JoinColumn({ name: 'speculation_id', referencedColumnName: 'id' })
  speculation: SpeculationEntity;

  @ManyToOne(
    type => GroupementEntity,
    (groupement: GroupementEntity) => groupement.ticketRelevages,
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  @JoinColumn({ name: 'exportateur_id', referencedColumnName: 'id' })
  groupement: GroupementEntity;

  @OneToOne(
    type => PlombEntity,
    (plomb: PlombEntity) => plomb.ticketRelevage,
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  @JoinColumn({ name: 'plomb_id', referencedColumnName: 'id' })
  plomb: PlombEntity;

  @ManyToOne(
    type => BookingEntity,
    (booking: BookingEntity) => booking.ticketRelevages,
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  @JoinColumn({ name: 'booking_id', referencedColumnName: 'id' })
  booking: BookingEntity;

  @ManyToOne(
    type => TransitairesEntity,
    (transitaire: TransitairesEntity) => transitaire.ticketRelevages,
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  @JoinColumn({ name: 'transitaire_id', referencedColumnName: 'id' })
  transitaire: TransitairesEntity;

  @OneToOne(
    type => ConteneurEntity,
    (conteneur: ConteneurEntity) => conteneur.ticketRelevage,
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  @JoinColumn({ name: 'conteneur_id', referencedColumnName: 'id' })
  conteneur: ConteneurEntity;

  @OneToOne(
    type => FileTicketRelevageEntity,
    (fileTicket: FileTicketRelevageEntity) => fileTicket.ticket,
    { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'    }
  )
  fileTicket: FileTicketRelevageEntity;

}