import { FournisseursEntity } from "src/apps/comptabilite/fournisseurs/fournisseurs.entity";
import { CompteBankExportateurEntity } from "src/apps/financials/compte-bank-exportateur/compte-bank-exportateur.entity";
import { ChargementEntity } from "src/apps/operations/chargements/chargement.entity";
import { LotEntity } from "src/apps/operations/lots/lot.entity";
import { SessionEntity } from "src/apps/operations/session/session.entity";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { BaseEntity, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { GroupementEntity } from "../groupement/groupement.entity";
import { InfosExportateurEntity } from "../infos-exportateur/infos-exportateur.entity";

@Entity('admin_exportateurs_groupement')
@Index("index_affectation", ['groupement_id', 'exportateur_id'], { unique: true })
export class ExportateursGroupementEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid'})
    groupement_id: string;

    @Column({ type: 'uuid'})
    exportateur_id: string;

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
        (groupement: GroupementEntity) => groupement.groupExport,
        { nullable: false, primary: true, onUpdate: 'CASCADE'}
    )
    @JoinColumn({ name: 'groupement_id', referencedColumnName: 'id' })
    groupement: GroupementEntity;
    
    @ManyToOne(
        type => InfosExportateurEntity,
        (exportateur: InfosExportateurEntity) => exportateur.groupExport,
        { nullable: false, primary: true, onUpdate: 'CASCADE', eager: true }
    )
    @JoinColumn({ name: 'exportateur_id', referencedColumnName: 'id' })
    exportateur: InfosExportateurEntity;

    @OneToMany(
        type => CompteBankExportateurEntity,
        (compte: CompteBankExportateurEntity) => compte.finGroupExport,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    compte: CompteBankExportateurEntity[];

    @OneToOne(
        type => FournisseursEntity,
        (fournisTransit: FournisseursEntity) => fournisTransit.exportateur,
        { nullable: true, primary: true, onUpdate: 'CASCADE' }
    )
    fournisTransit: FournisseursEntity;

    @OneToMany(
        type => LotEntity,
        (lots: LotEntity) => lots.exportateur,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    lots: LotEntity[];

    @OneToMany(
        type => ChargementEntity,
        (chargements: ChargementEntity) => chargements.exportateur,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    chargements: ChargementEntity[];

    @OneToOne(
        type => SessionEntity,
        (expRecevant: SessionEntity) => expRecevant.recevant,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
      )
      expRecevant: SessionEntity;
    
      @OneToOne(
        type => SessionEntity,
        (expCedant: SessionEntity) => expCedant.cedant,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
      )
      expCedant: SessionEntity;
}