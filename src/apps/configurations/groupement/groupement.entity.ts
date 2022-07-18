import { CompteBankGroupementEntity } from "src/apps/financials/compte-bank-generale/compte-bank-generale.entity";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { BaseEntity, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ExportateursGroupementEntity } from "../exportateurs-groupement/exportateurs-groupement.entity";
import { BonLivraisonEntity } from '../../operations/bon-livraison/bon-livraison.entity';
import { TicketRelevageEntity } from "src/apps/operations/ticket-relevage/ticket-relevage.entity";
import { LogoGroupementEntity } from "./logo/file-logo.entity";
import { PersonanlisationEntity } from "./personnalisation/personnalisation.entity";
import { AccountEntity } from "../account/account.entity";
import { ContratsEntity } from "src/apps/financials/contrats/contrats.entity";
@Entity('admin_groupement')
export class GroupementEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 150 })
    libelle: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'varchar', length: 150 })
    contribuable: string;

    @Column({ type: 'varchar', length: 30 })
    contact: string;

    @Column({ type: 'varchar', length: 150 })
    email: string;

    @Column({ type: 'varchar', length: 100 })
    postal: string;

    @Column({ type: 'varchar', length: 255 })
    lieu: string;

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
        type => LogoGroupementEntity,
        (logo: LogoGroupementEntity) => logo.groupement,
        { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    logo: LogoGroupementEntity;

    @OneToOne(
        type => PersonanlisationEntity,
        (perso: PersonanlisationEntity) => perso.groupement,
        { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    perso: PersonanlisationEntity;

    @OneToMany(
        type => CompteBankGroupementEntity,
        (comptes: CompteBankGroupementEntity) => comptes.groupements,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    comptes: CompteBankGroupementEntity[];

    @OneToMany(
        type => BonLivraisonEntity,
        (Bonlivraisons: BonLivraisonEntity) => Bonlivraisons.groupement,
        { nullable: false, primary: true, onUpdate: 'CASCADE'}
    )
    Bonlivraisons: BonLivraisonEntity[];

    @OneToMany(
        type => ExportateursGroupementEntity,
        (groupExport: ExportateursGroupementEntity) => groupExport.groupement,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    groupExport: ExportateursGroupementEntity[];

    @OneToMany(
        type => TicketRelevageEntity,
        (ticketRelevages: TicketRelevageEntity) => ticketRelevages.groupement,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    ticketRelevages: TicketRelevageEntity[];

    @OneToMany(
        type => AccountEntity,
        (account: AccountEntity) => account.groupement,
        { nullable: true, primary: true, onUpdate: 'CASCADE' }
    )
    account: AccountEntity[];

    @OneToMany(
        type => ContratsEntity,
        (contrats: ContratsEntity) => contrats.groupement,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    contrats: ContratsEntity[];

}