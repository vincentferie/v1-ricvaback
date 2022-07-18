import { BalanceEntity } from 'src/apps/operations/balance/balance.entity';
import { BalayureEntity } from 'src/apps/operations/balayure/balayure.entity';
import { ChargementEntity } from 'src/apps/operations/chargements/chargement.entity';
import { EmpotagesEntity } from 'src/apps/operations/empotage/empotage.entity';
import { LotEntity } from 'src/apps/operations/lots/lot.entity';
import { TransfertEntity } from 'src/apps/operations/transfert/transfert.entity';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity, JoinColumn, ManyToOne, Double, OneToOne } from 'typeorm';
import { SiteEntity } from '../sites/site.entity';

@Entity('admin_entrepot')
export class EntrepotEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @Column({ type: 'uuid' })
  // exportateur_id: string;

  @Column({ type: 'uuid' })
  site_id: string;
  
  @Column({type:'varchar', length: 150, unique: true})
  libelle: string;

  @Column({type:'float', nullable:true})
  superficie: Double;

  @Column({type:'float', nullable:true})
  coordonneex: Double;
  
  @Column({type:'float', nullable:true})
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

  // @ManyToOne(
  //   type => InfosExportateurEntity,
  //   (exportateur: InfosExportateurEntity) => exportateur.entrepots,
  //   { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE', eager: true }
  // )
  // @JoinColumn({ name: 'exportateur_id', referencedColumnName: 'id' })
  // exportateur: InfosExportateurEntity;

  @OneToMany(
    type => TransfertEntity,
    (transfertEntrepotProvenances: TransfertEntity) => transfertEntrepotProvenances.entrepotProvenance,
    { nullable: false, primary: true, onUpdate: 'CASCADE' }
  )
  transfertEntrepotProvenances: TransfertEntity[];

  @OneToMany(
    type => TransfertEntity,
    (transfertEntrepotDestinations: TransfertEntity) => transfertEntrepotDestinations.entrepotDestination,
    { nullable: false, primary: true, onUpdate: 'CASCADE' }
  )
  transfertEntrepotDestinations: TransfertEntity[];


  @ManyToOne(
    type => SiteEntity,
    (site: SiteEntity) => site.entrepots,
    { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    @JoinColumn({ name: 'site_id', referencedColumnName: 'id' })
    site: SiteEntity;

  @OneToMany(
      type => LotEntity,
      (lots: LotEntity) => lots.entrepot,
      { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    lots: LotEntity[];

  @OneToMany(
    type => EmpotagesEntity,
    (empotages: EmpotagesEntity) => empotages.entrepot,
    { nullable: false, primary: true, onUpdate: 'CASCADE' }
  )
  empotages: EmpotagesEntity[];
  
  @OneToMany(
    type => ChargementEntity,
    (chargements: ChargementEntity) => chargements.entrepot,
    { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    chargements: ChargementEntity[];

    @OneToMany(
      type => BalanceEntity,
      (balances: BalanceEntity) => balances.entrepot,
      { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    balances: BalanceEntity[];

    @OneToMany(
      type => BalayureEntity,
      (balayure: BalayureEntity) => balayure.entrepot,
      { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    balayure: BalayureEntity[];
  
}