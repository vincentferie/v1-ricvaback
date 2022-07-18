import { EntrepotEntity } from 'src/apps/configurations/entrepots/entrepot.entity';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BaseEntity, OneToOne, Index } from 'typeorm';
import { LotEntity } from '../lots/lot.entity';

@Entity('admin_transfert')
@Index("index_lot_prov_dest", ['lot_id', 'entrepot_provenance_id', 'entrepot_destination_id'], { unique: true })
export class TransfertEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  lot_id: string;

  @Column({ type: 'uuid' })
  entrepot_provenance_id: string;

  @Column({ type: 'uuid' })
  entrepot_destination_id: string;

  @Column({ type: 'int' })
  poids_net_mq: number;

  @Column({ type: 'int' })
  sac_mq: number;

  @Column({ type: 'int' })
  poids_net_dechet: number;

  @Column({ type: 'int' })
  sac_dechet: number;

  @Column({ type: 'int' })
  poids_net_poussiere: number;

  @Column({ type: 'int' })
  sac_poussiere: number;

  @Column({ type: 'int' })
  total_sac_trie: number;

  @Column({ type: 'varchar', length: 150 })
  statut_triage: string;

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
    (lots: LotEntity) => lots.transferts,
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  @JoinColumn({ name: 'lot_id' , referencedColumnName: 'id'})
  lots: LotEntity;

  @ManyToOne(
    type => EntrepotEntity,
    (entrepotProvenance: EntrepotEntity) => entrepotProvenance.transfertEntrepotProvenances,
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  @JoinColumn({ name: 'entrepot_provenance_id', referencedColumnName: 'id' })
  entrepotProvenance: EntrepotEntity;

  @ManyToOne(
    type => EntrepotEntity,
    (entrepotDestination: EntrepotEntity) => entrepotDestination.transfertEntrepotDestinations,
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  @JoinColumn({ name: 'entrepot_destination_id', referencedColumnName: 'id' })
  entrepotDestination: EntrepotEntity;
}