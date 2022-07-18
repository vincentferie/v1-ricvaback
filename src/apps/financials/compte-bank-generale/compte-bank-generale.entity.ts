import { CampagneEntity } from "src/apps/configurations/campagne/campagne.entity";
import { GroupementEntity } from "src/apps/configurations/groupement/groupement.entity";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { StateTirage } from "src/helpers/enums/state.enum";
import { BaseEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BanquesEntity } from "../banques/banques.entity";
@Entity('admin_compte_groupement')
@Index("index_groupement_banque_numero", ['groupement_id', 'banque_id', 'numero'], { unique: true })
export class CompteBankGroupementEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 150, nullable: true })
    numero: string;

    @Column({ type: 'uuid'})
    campagne_id: string;

    @Column({ type: 'uuid'})
    groupement_id: string;

    @Column({ type: 'uuid'})
    banque_id: string;

    @Column({type: 'bigint'})
    solde: number;

    @Column({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
    date_tirage: Date;

    @Column({ type: 'enum', enum: StateTirage, default: StateTirage.decouvert })
    type: StateTirage;

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
        (groupements: GroupementEntity) => groupements.comptes,
        { nullable: false, primary: true, onUpdate: 'CASCADE'}
    )
    @JoinColumn({ name: 'groupement_id', referencedColumnName: 'id' })
    groupements: GroupementEntity;

    @ManyToOne(
        type => BanquesEntity,
        (banque: BanquesEntity) => banque.comptesGroupement,
        { nullable: false, primary: true, onUpdate: 'CASCADE'}
    )
    @JoinColumn({ name: 'banque_id', referencedColumnName: 'id' })
    banque: BanquesEntity;

    @ManyToOne(
        type => CampagneEntity,
        (campagne: CampagneEntity) => campagne.banqueGroupement,
        { nullable: false, primary: true, onUpdate: 'CASCADE'}
    )
    @JoinColumn({ name: 'campagne_id', referencedColumnName: 'id' })
    campagne: CampagneEntity;


}