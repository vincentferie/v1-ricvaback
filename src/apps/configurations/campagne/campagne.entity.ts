import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { BaseEntity, Column, Double, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CampagneSpecEntity } from "../campagne-spec/campagne-spec.entity";
import { LotEntity } from '../../operations/lots/lot.entity';
import { ChargementEntity } from '../../operations/chargements/chargement.entity';
import { TicketRelevageEntity } from '../../operations/ticket-relevage/ticket-relevage.entity';
import { BalanceEntity } from '../../operations/balance/balance.entity';
import { SpeculationEntity } from "../speculations/speculation.entity";
import { CompteBankGroupementEntity } from "src/apps/financials/compte-bank-generale/compte-bank-generale.entity";
import { CompteBankExportateurEntity } from "src/apps/financials/compte-bank-exportateur/compte-bank-exportateur.entity";
import { ContratsEntity } from "src/apps/financials/contrats/contrats.entity";
import { FactureBlEntity } from "src/apps/financials/facture-bl/facture-bl.entity";
import { NantissementEntity } from "src/apps/financials/nantissement/nantissement.entity";
import { DenantissementEntity } from "src/apps/financials/denantissement/denantissement.entity";
import { ReglementsFactureBlEntity } from "src/apps/financials/reglement-factures-bl/reglement-factures-bl.entity";
import { CampagneOutturnEntity } from "./outturn/outturn.entity";
import { TrackingVgmEntity } from "src/apps/operations/tracking/tracking-vgm.entity";

@Entity('admin_campagne')
export class CampagneEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'uuid'})
    speculation_id: string;

    @Column({ type: 'varchar', length: 150, unique: true })
    libelle: string;

    @Column({ type: 'decimal' })
    prix_bord: Double;

    @Column({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
    ouverture: Date;

    @Column({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
    fermeture: Date;

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
        type => SpeculationEntity,
        (speculation: SpeculationEntity) => speculation.campagne,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    @JoinColumn({ name: 'speculation_id', referencedColumnName: 'id' })
    speculation: SpeculationEntity;

    @OneToMany(
        type => CampagneSpecEntity,
        (detailsCampagne: CampagneSpecEntity) => detailsCampagne.campagne,
        { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'}
    )
    detailsCampagne: CampagneSpecEntity[];

    @OneToMany(
        type => CampagneOutturnEntity,
        (outturn: CampagneOutturnEntity) => outturn.campagne,
        { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'}
    )
    outturn: CampagneOutturnEntity[];

    @OneToMany(
        type => LotEntity,
        (lots: LotEntity) => lots.campagne,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    lots: LotEntity[];

    @OneToMany(
        type => ChargementEntity,
        (chargements: ChargementEntity) => chargements.campagne,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    chargements: ChargementEntity[];

    @OneToMany(
        type => BalanceEntity,
        (balances: BalanceEntity) => balances.campagne,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    balances: BalanceEntity[];

    @OneToMany(
        type => TicketRelevageEntity,
        (ticketRelevages: TicketRelevageEntity) => ticketRelevages.campagne,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    ticketRelevages: TicketRelevageEntity[];

    @OneToMany(
        type => CompteBankGroupementEntity,
        (banqueGroupement: CompteBankGroupementEntity) => banqueGroupement.campagne,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    banqueGroupement: CompteBankGroupementEntity[];

    @OneToMany(
        type => CompteBankExportateurEntity,
        (banqueExportateur: CompteBankExportateurEntity) => banqueExportateur.campagne,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    banqueExportateur: CompteBankExportateurEntity[];

    @OneToMany(
        type => ContratsEntity,
        (contrat: ContratsEntity) => contrat.campagne,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    contrat: ContratsEntity[];

    @OneToMany(
        type => FactureBlEntity,
        (factureBl: FactureBlEntity) => factureBl.campagne,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    factureBl: FactureBlEntity[];

    @OneToMany(
        type => NantissementEntity,
        (nantissement: NantissementEntity) => nantissement.campagne,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    nantissement: NantissementEntity[];

    @OneToMany(
        type => DenantissementEntity,
        (denantissement: DenantissementEntity) => denantissement.campagne,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    denantissement: DenantissementEntity[];

    @OneToMany(
        type => ReglementsFactureBlEntity,
        (reglementFactureBl: ReglementsFactureBlEntity) => reglementFactureBl.campagne,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    reglementFactureBl: ReglementsFactureBlEntity[];

    @OneToMany(
        type => TrackingVgmEntity,
        (trackingVgm: TrackingVgmEntity) => trackingVgm.campagne,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    trackingVgm: TrackingVgmEntity[];


}