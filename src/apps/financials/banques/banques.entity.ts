import { ReglementChargesEntity } from "src/apps/comptabilite/reglement-charges/reglement-charges.entity";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BanquesSpecEntity } from "../banques-spec/banques-spec.entity";
import { CompteBankExportateurEntity } from "../compte-bank-exportateur/compte-bank-exportateur.entity";
import { CompteBankGroupementEntity } from "../compte-bank-generale/compte-bank-generale.entity";
import { ReglementsFactureBlEntity } from "../reglement-factures-bl/reglement-factures-bl.entity";
import { TierDetenteursEntity } from "../tiers-detenteur/tiers-detenteur.entity";

@Entity('admin_banques')
export class BanquesEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 150, unique: true})
    libelle: string;

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

    @OneToMany(
        type => BanquesSpecEntity,
        (details: BanquesSpecEntity) => details.banques,
        { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'}
    )
    details: BanquesSpecEntity[];

    @OneToMany(
        type => CompteBankGroupementEntity,
        (comptesGroupement: CompteBankGroupementEntity) => comptesGroupement.banque,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    comptesGroupement: CompteBankGroupementEntity[];

    @OneToMany(
        type => CompteBankExportateurEntity,
        (comptesExportateurs: CompteBankExportateurEntity) => comptesExportateurs.banque,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    comptesExportateurs: CompteBankExportateurEntity[];

    @OneToMany(
        type => TierDetenteursEntity,
        (tierDetenteurs: TierDetenteursEntity) => tierDetenteurs.banque,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    tierDetenteurs: TierDetenteursEntity[];

    @OneToMany(
        type => ReglementsFactureBlEntity,
        (reglements: ReglementsFactureBlEntity) => reglements.banque,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    reglements: ReglementsFactureBlEntity[];

    @OneToMany(
        type => ReglementChargesEntity,
        (reglementsCharge: ReglementChargesEntity) => reglementsCharge.banque,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    reglementsCharge: ReglementChargesEntity[];

}