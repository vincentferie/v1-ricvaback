import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity, Double, ManyToOne, JoinColumn } from 'typeorm';
import { LotEntity } from '../../operations/lots/lot.entity';
import { EntrepotEntity } from '../entrepots/entrepot.entity';
import { ChargeBlEntity } from 'src/apps/comptabilite/charges/bl-charges/bl-charges.entity';
import { VilleEntity } from '../ville/ville.entity';

@Entity('admin_site')
export class SiteEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  ville_id: string;

  @Column({ type: 'varchar', length: 150 })
  libelle: string;

  @Column({ type: 'float', nullable: true })
  superficie: Double;

  @Column({ type: 'float', nullable: true })
  coordonneex: Double;

  @Column({ type: 'float', nullable: true })
  coordonneey: Double;

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
    type => VilleEntity,
    (ville: VilleEntity) => ville.sites,
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  @JoinColumn({ name: 'ville_id', referencedColumnName: 'id' })
  ville: VilleEntity;

  @OneToMany(
    type => EntrepotEntity,
    (entrepots: EntrepotEntity) => entrepots.site,
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  entrepots: EntrepotEntity[];

  @OneToMany(
    type => LotEntity,
    (lots: LotEntity) => lots.site,
    { nullable: false, primary: true, onUpdate: 'CASCADE' }
  )
  lots: LotEntity[];

  @OneToMany(
    type => ChargeBlEntity,
    (chargeBl: ChargeBlEntity) => chargeBl.site,
    { nullable: false, primary: true, onUpdate: 'CASCADE' }
  )
  chargeBl: ChargeBlEntity[];

}