import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BaseEntity, OneToMany, Double, OneToOne } from 'typeorm';
import { CampagneEntity } from 'src/apps/configurations/campagne/campagne.entity';
import { EntrepotEntity } from 'src/apps/configurations/entrepots/entrepot.entity';
import { ZonageEntity } from 'src/apps/configurations/zonage/zonage.entity';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { StateChargement } from 'src/helpers/enums/state.enum';
import { LotEntity } from '../lots/lot.entity';
import { ExportateursGroupementEntity } from 'src/apps/configurations/exportateurs-groupement/exportateurs-groupement.entity';
import { AccountEntity } from 'src/apps/configurations/account/account.entity';
import { FileChargementEntity } from './fiche-chargement/file-chargement.entity';
import { VilleEntity } from 'src/apps/configurations/ville/ville.entity';
import { SpeculationEntity } from 'src/apps/configurations/speculations/speculation.entity';

@Entity('admin_chargement')
export class ChargementEntity extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  superviseur_id: string;

  @Column({ type: 'uuid' })
  campagne_id: string;

  @Column({ type: 'uuid' })
  provenance_id: string;

  @Column({ type: 'uuid' })
  zonage_id: string;

  @Column({ type: 'uuid' })
  exportateur_id: string;

  @Column({ type: 'uuid' })
  entrepot_id: string;

  @Column({ type: 'uuid' })
  speculation_id: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  num_fiche: string;

  @Column({ type: 'timestamp without time zone' })
  date_chargement: Date;

  @Column({ type: 'varchar', length: 50  })
  tracteur: string;

  @Column({ type: 'varchar', length: 50  })
  remorque: string;

  @Column({ type: 'varchar', length: 150  })
  fournisseur: string;

  @Column({ type: 'varchar', length: 50  })
  contact_fournisseur: string;

  @Column({ type: 'varchar', length: 150  })
  transporteur: string;

  @Column({ type: 'enum', enum: StateChargement, default: StateChargement.valider })
  statut: StateChargement;

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
    type => AccountEntity,
    (superviseur: AccountEntity) => superviseur.chargements,
    { nullable: false, primary: true, onUpdate: 'CASCADE', eager: true}
  )
  @JoinColumn({ name: 'superviseur_id', referencedColumnName: 'id' })
  superviseur: AccountEntity;

  @ManyToOne(
    type => CampagneEntity,
    (campagne: CampagneEntity) => campagne.chargements,
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  @JoinColumn({ name: 'campagne_id', referencedColumnName: 'id' })
  campagne: CampagneEntity;
  
  @ManyToOne(
    type => VilleEntity,
    (provenance: VilleEntity) => provenance.chargements,
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  @JoinColumn({ name: 'provenance_id', referencedColumnName: 'id' })
  provenance: VilleEntity;

  @ManyToOne(
    type => ZonageEntity,
    (zonage: ZonageEntity) => zonage.chargements,
    { nullable: false, primary: true, onUpdate: 'CASCADE' }
  )
  @JoinColumn({ name: 'zonage_id', referencedColumnName: 'id' })
  zonage: ZonageEntity;

  @ManyToOne(
    type => ExportateursGroupementEntity,
    (exportateur: ExportateursGroupementEntity) => exportateur.chargements,
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  @JoinColumn({ name: 'exportateur_id', referencedColumnName: 'id' })
  exportateur: ExportateursGroupementEntity;

  @ManyToOne(
    type => EntrepotEntity,
    (entrepot: EntrepotEntity) => entrepot.chargements,
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  @JoinColumn({ name: 'entrepot_id', referencedColumnName: 'id' })
  entrepot: EntrepotEntity;

  @ManyToOne(
    type => SpeculationEntity,
    (speculation: SpeculationEntity) => speculation.chargement,
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  @JoinColumn({ name: 'speculation_id', referencedColumnName: 'id' })
  speculation: SpeculationEntity;

  @OneToMany(
    type => LotEntity,
    (lots: LotEntity) => lots.chargement,
    { nullable: false, primary: true, onUpdate: 'RESTRICT' }
  )
  lots: LotEntity[];

  @OneToOne(
    type => FileChargementEntity,
    (fiche: FileChargementEntity) => fiche.chargement,
    { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' }
  )
  fiche: FileChargementEntity;


}