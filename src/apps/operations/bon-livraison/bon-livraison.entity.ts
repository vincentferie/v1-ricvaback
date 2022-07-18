import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, BaseEntity, OneToOne } from 'typeorm';
import { ChargeBlEntity } from 'src/apps/comptabilite/charges/bl-charges/bl-charges.entity';
import { GroupementEntity } from 'src/apps/configurations/groupement/groupement.entity';
import { FactureBlEntity } from 'src/apps/financials/facture-bl/facture-bl.entity';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { DetailBlEntity } from './details-bl/detail-bl.entity';
import { FileBlEntity } from './files-bl/file-bl.entity';

@Entity('admin_bill_of_lading')
export class BonLivraisonEntity extends BaseEntity {
  
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  groupement_id: string;

  @Column({ type: 'varchar', length: 50 })
  numero_voyage: string;

  @Column({ type: 'varchar', length: 50 })
  numero_bl: string;

  @Column({ type: 'varchar', length: 150 })
  destination: string;

  @Column({ type: 'varchar', length: 150 })
  provenance: string;

  @Column({ type: 'varchar', length: 150 })
  amateur: string;

  @Column({ type: 'varchar', length: 150 })
  nom_client: string;

  @Column({ type: 'varchar', length: 150 })
  adresse_client: string;

  @Column({ type: 'varchar', length: 150 })
  pays_client: string;

  @Column({ type: 'varchar', length: 150 })
  port_depart: string;

  @Column({ type: 'varchar', length: 150 })
  port_arrive: string;

  @Column({ type: 'timestamp without time zone' })
  date_embarquement: Date;

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
    type => GroupementEntity,
    (groupements: GroupementEntity) => groupements.Bonlivraisons,
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  @JoinColumn({ name: 'groupement_id', referencedColumnName: 'id' })
  groupement: GroupementEntity;

  @OneToOne(
    type => FileBlEntity,
    (filesbl: FileBlEntity) => filesbl.bonLivraison,
    { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' }
  )
  filesbl: FileBlEntity;

  @OneToMany(
    type => DetailBlEntity,
    (details: DetailBlEntity) => details.bonLivraison,
    { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' }
  )
  details: DetailBlEntity[];

  @OneToMany(
    type => FactureBlEntity,
    (factures: FactureBlEntity) => factures.billOfLanding,
    { nullable: false, primary: true, onUpdate: 'CASCADE' }
  )
  factures: FactureBlEntity[];

  @OneToMany(
    type => ChargeBlEntity,
    (charges: ChargeBlEntity) => charges.billOfLanding,
    { nullable: false, primary: true, onUpdate: 'CASCADE' }
  )
  charges: ChargeBlEntity[];
}