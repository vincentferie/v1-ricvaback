import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, BaseEntity } from 'typeorm';
import { LotEntity } from '../lots/lot.entity';
import { CampagneEntity } from '../../configurations/campagne/campagne.entity';
import { EntrepotEntity } from 'src/apps/configurations/entrepots/entrepot.entity';
@Entity('admin_balance')
export class BalanceEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  lot_id: string;

  @Column({ type: 'uuid' })
  entrepot_id: string;

  @Column({ type: 'uuid' })
  campagne_id: string;

  @Column({ type: 'int' })
  nbre_sacs: number;

  @Column({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

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
    type => LotEntity,
    (lots: LotEntity) => lots.balances,
    { nullable: true, primary: true, onUpdate: 'CASCADE'}
  )
  @JoinColumn({ name: 'lot_id', referencedColumnName: 'id' })
  lots: LotEntity;

  @ManyToOne(
    type => EntrepotEntity,
    (entrepot: EntrepotEntity) => entrepot.balances,
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  @JoinColumn({ name: 'entrepot_id', referencedColumnName: 'id' })
  entrepot: EntrepotEntity;

  @ManyToOne(
    type => CampagneEntity,
    (campagne: CampagneEntity) => campagne.balances,
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  @JoinColumn({ name: 'campagne_id', referencedColumnName: 'id' })
  campagne: CampagneEntity;
}