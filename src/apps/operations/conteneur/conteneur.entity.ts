import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, BaseEntity, Timestamp, Unique, OneToOne } from 'typeorm';
import { BookingEntity } from '../booking/booking.entity';
import { EmpotagesEntity } from '../empotage/empotage.entity';
import { DetailBlEntity } from '../bon-livraison/details-bl/detail-bl.entity';
import { PlombEntity } from '../plomb/plomb.entity';
import { TicketRelevageEntity } from '../ticket-relevage/ticket-relevage.entity';
import { AccountEntity } from 'src/apps/configurations/account/account.entity';


@Entity('admin_conteneur')
export class ConteneurEntity extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  booking_id: string;

  @Column({ type: 'uuid' })
  superviseur_id: string;

  @Column({ type: 'varchar', length: 150 })
  numero: string;
  
  @Column({ type: 'int' })
  capacite: number;

  @Column({ type: 'varchar', length: 150 })
  type_tc: string;

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
    type => BookingEntity,
    (booking: BookingEntity) => booking.conteneurs,
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  @JoinColumn({ name: 'booking_id', referencedColumnName: 'id' })
  booking: BookingEntity;

  @ManyToOne(
    type => AccountEntity,
    (superviseur: AccountEntity) => superviseur.conteneurs,
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  @JoinColumn({ name: 'superviseur_id', referencedColumnName: 'id' })
  superviseur: AccountEntity;

  @OneToMany(
    type => EmpotagesEntity,
    (empotages: EmpotagesEntity) => empotages.conteneur,
    { nullable: false, primary: true, onUpdate: 'CASCADE' }
  )
  empotages: EmpotagesEntity[];

  @OneToMany(
    type => DetailBlEntity,
    (detailBls: DetailBlEntity) => detailBls.conteneur,
    { nullable: false, primary: true, onUpdate: 'CASCADE' }
  )
  detailBls: DetailBlEntity[];

  @OneToOne(
    type => PlombEntity,
    (plomb: PlombEntity) => plomb.conteneur,
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  plomb: PlombEntity;

  @OneToOne(
    type => TicketRelevageEntity,
    (ticketRelevage: TicketRelevageEntity) => ticketRelevage.conteneur,
    { nullable: false, primary: true, onUpdate: 'CASCADE' }
  )
  ticketRelevage: TicketRelevageEntity;

}