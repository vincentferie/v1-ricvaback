import { CampagneEntity } from "src/apps/configurations/campagne/campagne.entity";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { StateLots } from "src/helpers/enums/state.enum";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BanquesEntity } from "../banques/banques.entity";
import { DenantissementEntity } from "../denantissement/denantissement.entity";
import { TierDetenteursEntity } from "../tiers-detenteur/tiers-detenteur.entity";
import { AutorisationSortieEntity } from "./files-nantissement/autorisation-sortie/autorisation-sortie.entity";
import { LettreDetentionEntity } from "./files-nantissement/lettre-detention/lettre-detention.entity";
import { LotsNantisEntity } from "./lots-nantis/lots-nantis.entity";

@Entity('admin_nantissement')
export class NantissementEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid'})
    campagne_id: string;

    @Column({ type: 'uuid'})
    banque_id: string;

    @Column({ type: 'uuid'})
    tiers_id: string;

    @Column({ type: 'varchar', length: 300, unique: true})
    numero_lettre: string;

    @Column({ type: 'bigint'})
    montant: number;

    @Column({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP'})
    date_nantissement: Date;

    @Column({ type: 'enum', enum: StateLots, default: StateLots.nantis })
    statut: StateLots;

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
        type => BanquesEntity,
        (banque: BanquesEntity) => banque.tierDetenteurs,
        { nullable: false, primary: true, onUpdate: 'CASCADE'}
    )
    @JoinColumn({ name: 'banque_id', referencedColumnName: 'id' })
    banque: BanquesEntity;

    @ManyToOne(
        type => TierDetenteursEntity,
        (tierDetenteur: TierDetenteursEntity) => tierDetenteur.nantissements,
        { nullable: false, primary: true, onUpdate: 'CASCADE'}
    )
    @JoinColumn({ name: 'tiers_id', referencedColumnName: 'id' })
    tierDetenteur: TierDetenteursEntity;

    @OneToMany(
        type => LotsNantisEntity,
        (lotsNantis: LotsNantisEntity) => lotsNantis.nantissement,
        { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    lotsNantis: LotsNantisEntity[];

    @OneToOne(
        type => LettreDetentionEntity,
        (lettre: LettreDetentionEntity) => lettre.nantissement,
        { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    lettre: LettreDetentionEntity;

    @OneToOne(
        type => AutorisationSortieEntity,
        (autorisation: AutorisationSortieEntity) => autorisation.nantissement,
        { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    autorisation: AutorisationSortieEntity;

    @OneToOne(
        type => DenantissementEntity,
        (denantissement: DenantissementEntity) => denantissement.nantissement,
        { nullable: false, primary: true, onUpdate: 'CASCADE'}
    )
    denantissement: DenantissementEntity;

    @ManyToOne(
        type => CampagneEntity,
        (campagne: CampagneEntity) => campagne.nantissement,
        { nullable: false, primary: true, onUpdate: 'CASCADE'}
    )
    @JoinColumn({ name: 'campagne_id', referencedColumnName: 'id' })
    campagne: CampagneEntity;

}