import { BaseEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { ExportateursGroupementEntity } from "src/apps/configurations/exportateurs-groupement/exportateurs-groupement.entity";
import { BanquesEntity } from "../banques/banques.entity";
import { StateTirage } from "src/helpers/enums/state.enum";
import { CampagneEntity } from "src/apps/configurations/campagne/campagne.entity";

@Entity('admin_compte_exportateurs')
@Index("index_campagne_exportateur_banque_numero", ['campagne_id','exportateur_id', 'banque_id', 'numero'], { unique: true })

export class CompteBankExportateurEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 150})
    numero: string;

    @Column({ type: 'uuid'})
    campagne_id: string;

    @Column({ type: 'uuid'})
    exportateur_id: string;

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
        type => CampagneEntity,
        (campagne: CampagneEntity) => campagne.banqueExportateur,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    @JoinColumn({ name: 'campagne_id', referencedColumnName: 'id' })
    campagne: CampagneEntity;

    @ManyToOne(
        type => ExportateursGroupementEntity,
        (finGroupExport: ExportateursGroupementEntity) => finGroupExport.compte,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    @JoinColumn({ name: 'exportateur_id', referencedColumnName: 'id' })
    finGroupExport: ExportateursGroupementEntity;

    @ManyToOne(
        type => BanquesEntity,
        (banque: BanquesEntity) => banque.comptesExportateurs,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    @JoinColumn({ name: 'banque_id', referencedColumnName: 'id' })
    banque: BanquesEntity;  

}