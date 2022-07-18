import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, BaseEntity, OneToOne, Index } from 'typeorm';
import { TransfertEntity } from '../transfert/transfert.entity';
import { SpeculationEntity } from '../../configurations/speculations/speculation.entity';
import { SiteEntity } from 'src/apps/configurations/sites/site.entity';
import { CampagneEntity } from 'src/apps/configurations/campagne/campagne.entity';
import { AnalysesEntity } from '../analyse/analyse.entity';
import { BalanceEntity } from '../balance/balance.entity';
import { BalayureEntity } from '../balayure/balayure.entity';
import { EntrepotEntity } from 'src/apps/configurations/entrepots/entrepot.entity';
import { ChargementEntity } from '../chargements/chargement.entity';
import { ExportateursGroupementEntity } from 'src/apps/configurations/exportateurs-groupement/exportateurs-groupement.entity';
import { StateLots } from 'src/helpers/enums/state.enum';
import { FileTicketEntity } from './file-ticket/file-ticket-pesee.entity';
import { ZonageEntity } from 'src/apps/configurations/zonage/zonage.entity';
import { LotsNantisEntity } from 'src/apps/financials/nantissement/lots-nantis/lots-nantis.entity';
import { AccountEntity } from 'src/apps/configurations/account/account.entity';
import { LotEmpoteEntity } from '../empotage/lot-empote/lot-empote.entity';
import { SessionEntity } from '../session/session.entity';

@Entity('admin_lot')
@Index("index_campagne_entrepot_numerolot", ['campagne_id', 'entrepot_id', 'numero_lot'], { unique: true })
export class LotEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  superviseur_id: string;

  @Column({ type: 'uuid' })
  campagne_id: string;

  @Column({ type: 'uuid' })
  site_id: string;

  @Column({ type: 'uuid' })
  entrepot_id: string;

  @Column({ type: 'uuid' })
  exportateur_id: string;

  @Column({ type: 'uuid' })
  speculation_id: string;

  @Column({ type: 'uuid', unique: true })
  chargement_id: string;

  @Column({ type: 'uuid' })
  zonage_id: string;

  @Column({ type: 'bigint'})
  numero_ticket_pese: number;

  @Column({ type: 'varchar', length: 300, unique: true })
  code_dechargement: string;

  @Column({ type: 'bigint'})
  numero_lot: number;

  @Column({ type: 'int'})
  sac_en_stock: number;

  @Column({ type: 'int' })
  premiere_pesee: number;

  @Column({ type: 'int' })
  deuxieme_pesee: number;

  @Column({ type: 'int' })
  reconditionne: number;

  @Column({ type: 'int' })
  tare_emballage_refraction: number;

  @Column({ type: 'int' })
  sacs_decharge: number;

  @Column({ type: 'int' })
  poids_net: number;

  @Column({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP'})
  date_dechargement: Date;

  @Column({ type: 'enum', enum: StateLots, nullable: true })
  statut: StateLots;

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
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  @JoinColumn({ name: 'superviseur_id', referencedColumnName: 'id' })
  superviseur: AccountEntity;
  
  @ManyToOne(
    type => EntrepotEntity,
    (entrepot: EntrepotEntity) => entrepot.lots,
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  @JoinColumn({ name: 'entrepot_id', referencedColumnName: 'id' })
  entrepot: EntrepotEntity;

  @ManyToOne(
    type => ExportateursGroupementEntity,
    (exportateur: ExportateursGroupementEntity) => exportateur.lots,
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  @JoinColumn({ name: 'exportateur_id', referencedColumnName: 'id' })
  exportateur: ExportateursGroupementEntity;

  @ManyToOne(
    type => SpeculationEntity,
    (speculation: SpeculationEntity) => speculation.lots,
    { nullable: false, primary: true, onUpdate: 'CASCADE' }
  )
  @JoinColumn({ name: 'speculation_id', referencedColumnName: 'id' })
  speculation: SpeculationEntity;

  @ManyToOne(
    type => ChargementEntity,
    (chargement: ChargementEntity) => chargement.lots,
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  @JoinColumn({ name: 'chargement_id', referencedColumnName: 'id' })
  chargement: ChargementEntity;

  @ManyToOne(
    type => SiteEntity,
    (site: SiteEntity) => site.lots,
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  @JoinColumn({ name: 'site_id', referencedColumnName: 'id' })
  site: SiteEntity;

  @ManyToOne(
    type => CampagneEntity,
    (campagne: CampagneEntity) => campagne.lots,
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  @JoinColumn({ name: 'campagne_id', referencedColumnName: 'id' })
  campagne: CampagneEntity;

  @ManyToOne(
    type => ZonageEntity,
    (zonage: ZonageEntity) => zonage.lots,
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  @JoinColumn({ name: 'zonage_id', referencedColumnName: 'id' })
  zonage: ZonageEntity;

  @OneToMany(
    type => TransfertEntity,
    (transferts: TransfertEntity) => transferts.lots,
    { nullable: false, primary: true, onUpdate: 'CASCADE' }
  )
  transferts: TransfertEntity[];

  @OneToOne(
    type => AnalysesEntity,
    (analyses: AnalysesEntity) => analyses.lots,
    { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' }
  )
  analyses: AnalysesEntity;

  @OneToMany(
    type => BalayureEntity,
    (balayures: BalayureEntity) => balayures.lots,
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  balayures: BalayureEntity[];

  @OneToMany(
    type => BalanceEntity,
    (balances: BalanceEntity) => balances.lots,
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  balances: BalanceEntity[];

  @OneToMany(
    type => LotEmpoteEntity,
    (lotEmpote: LotEmpoteEntity) => lotEmpote.lot,
    { nullable: false, primary: true, onUpdate: 'CASCADE' }
  )
  lotEmpote: LotEmpoteEntity[];

  @OneToOne(
    type => FileTicketEntity,
    (file: FileTicketEntity) => file.lot,
    { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' }
  )
  file: FileTicketEntity;

  @OneToMany(
    type => LotsNantisEntity,
    (lotsNantis: LotsNantisEntity) => lotsNantis.lot,
    { nullable: false, primary: true, onUpdate: 'CASCADE' }
  )
  lotsNantis: LotsNantisEntity[];

  @OneToOne(
    type => SessionEntity,
    (session: SessionEntity) => session.lot,
    { nullable: false, primary: true, onUpdate: 'CASCADE' }
  )
  session: SessionEntity;
}