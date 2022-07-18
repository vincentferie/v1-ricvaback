import { ExportateursGroupementEntity } from 'src/apps/configurations/exportateurs-groupement/exportateurs-groupement.entity';
import { SiteEntity } from 'src/apps/configurations/sites/site.entity';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BaseEntity, OneToOne, Index } from 'typeorm';
import { LotEntity } from '../lots/lot.entity';

@Entity('admin_session')
@Index("index_lot_dest_rest", ['lot_id', 'recevant_id', 'cedant_id'], { unique: true })
export class SessionEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  lot_id: string;

  @Column({ type: 'uuid' })
  recevant_id: string;

  @Column({ type: 'uuid' })
  cedant_id: string;

  @Column({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
  date_session: Date;

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
    type => SiteEntity,
    (recevant: ExportateursGroupementEntity) => recevant.expRecevant,
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  @JoinColumn({ name: 'recevant_id', referencedColumnName: 'id' })
  recevant: ExportateursGroupementEntity;

  @OneToOne(
    type => SiteEntity,
    (cedant: ExportateursGroupementEntity) => cedant.expCedant,
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  @JoinColumn({ name: 'cedant_id', referencedColumnName: 'id' })
  cedant: ExportateursGroupementEntity;

  @OneToOne(
    type => LotEntity,
    (lot: LotEntity) => lot.session,
    { nullable: false, primary: true, onUpdate: 'CASCADE' }
  )
  @JoinColumn({ name: 'lot_id', referencedColumnName: 'id' })
  lot: LotEntity;

}