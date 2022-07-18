import { TransitairesEntity } from "src/apps/comptabilite/transitaires/transitaires.entity";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { StateEmpotage } from "src/helpers/enums/state.enum";
import { BaseEntity, Column, Double, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BookingEntity } from "../booking/booking.entity";
import { ConteneurEntity } from "../conteneur/conteneur.entity";
import { PlombEntity } from '../plomb/plomb.entity';
import { LotEmpoteEntity } from "./lot-empote/lot-empote.entity";
import { EntrepotEntity } from "src/apps/configurations/entrepots/entrepot.entity";

@Entity('admin_empotage')
export class EmpotagesEntity extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  entrepot_id: string;

  @Column({ type: 'uuid' })
  transitaire_id: string;

  @Column({ type: 'uuid' })
  booking_id: string;

  @Column({ type: 'uuid' })
  conteneur_id: string;

  @Column({ type: 'varchar', length: 150 })
  ot: string;

  @Column({ type: 'int' })
  tare: number;
  
  @Column({ type: 'float'})
  out_turn: Double;

  @Column({ type: 'timestamp without time zone' })
  date_empotage: Date;

  @Column({ type: 'enum', enum: StateEmpotage, nullable: true })
  statut: StateEmpotage;

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
    type => EntrepotEntity,
    (entrepot: EntrepotEntity) => entrepot.empotages,
    { nullable: false, primary: true, onUpdate: 'CASCADE' }
  )
  @JoinColumn({ name: 'entrepot_id', referencedColumnName: 'id' })
  entrepot: EntrepotEntity;

  @ManyToOne(
    type => TransitairesEntity,
    (transitaire: TransitairesEntity) => transitaire.empotages,
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  @JoinColumn({ name: 'transitaire_id', referencedColumnName: 'id' })
  transitaire: TransitairesEntity;

  @ManyToOne(
    type => ConteneurEntity,
    (conteneur: ConteneurEntity) => conteneur.empotages,
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  @JoinColumn({ name: 'conteneur_id', referencedColumnName: 'id' })
  conteneur: ConteneurEntity;

  @ManyToOne(
    type => BookingEntity,
    (booking: BookingEntity) => booking.empotages,
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  @JoinColumn({ name: 'booking_id', referencedColumnName: 'id' })
  booking: BookingEntity;

  @OneToOne(
    type => PlombEntity,
    (plombs: PlombEntity) => plombs.empotage,
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  plombs: PlombEntity[];

  @OneToMany(
    type => LotEmpoteEntity,
    (LotEmpote: LotEmpoteEntity) => LotEmpote.empotage,
    { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'}
  )
  LotEmpote: LotEmpoteEntity[];

}