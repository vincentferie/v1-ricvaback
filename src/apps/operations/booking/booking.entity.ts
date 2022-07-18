import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { StateBooking } from 'src/helpers/enums/state.enum';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity } from 'typeorm';
import { BonLivraisonEntity } from '../bon-livraison/bon-livraison.entity';
import { ConteneurEntity } from '../conteneur/conteneur.entity';
import { EmpotagesEntity } from '../empotage/empotage.entity';
import { TicketRelevageEntity } from '../ticket-relevage/ticket-relevage.entity';

@Entity('admin_booking')
export class BookingEntity extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 30 })
  numero_reel: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  numero_change: string;

  @Column({ type: 'enum', enum: StateBooking, default: StateBooking.encours })
  state: StateBooking;

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
    type => ConteneurEntity,
    (conteneurs: ConteneurEntity) => conteneurs.booking,
    { nullable: false, primary: true, onUpdate: 'CASCADE' }
  )
  conteneurs: ConteneurEntity[];

  @OneToMany(
    type => TicketRelevageEntity,
    (ticketRelevages: TicketRelevageEntity) => ticketRelevages.booking,
    { nullable: false, primary: true, onUpdate: 'CASCADE' }
  )
  ticketRelevages: TicketRelevageEntity[];

  @OneToMany(
    type => EmpotagesEntity,
    (empotages: EmpotagesEntity) => empotages.booking,
    { nullable: false, primary: true, onUpdate: 'CASCADE' }
  )
  empotages: EmpotagesEntity[];
}