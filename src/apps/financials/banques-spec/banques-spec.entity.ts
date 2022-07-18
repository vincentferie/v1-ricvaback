import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { BaseEntity, Column, Double, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BanquesEntity } from "../banques/banques.entity";

@Entity('admin_banques_spec')
export class BanquesSpecEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    banque_id: string;

    @Column({ type: 'varchar', length: 150})
    ligne: string;

    @Column({ type: 'bigint', nullable: true})
    montant: number;

    @Column({ type: 'varchar', length: 10, nullable: true})
    currency: string;

    @Column({ type: 'smallint', nullable: true})
    duree: number;

    @Column({ type: 'date', nullable: true})
    echeance: Date;

    @Column({ type: 'float', nullable: true})
    taux: Double;

    @Column({ type: 'bigint', nullable: true})
    hauteur_tirage: number;

    @Column({ type: 'smallint', nullable: true})
    duree_tirage: number;

    @Column({ type: 'bigint', nullable: true})
    compte_sequestre: number;

    @Column({ type: 'bigint', nullable: true})
    frais_tirage: number;

    @Column({ type: 'bigint', nullable: true})
    flat: number;

    @Column({ type: 'varchar', length: 150, nullable: true})
    libelle_garantie: string;

    @Column({ type: 'bigint', nullable: true})
    depot_garantie:number;

    @Column({ type: 'bigint', nullable: true})
    limite_garantie: number;

    @Column({ type: 'float', nullable: true})
    frais_dossier: Double;

    @Column({ type: 'float', nullable: true})
    frais_struct: Double;

    @Column({ type: 'float', nullable: true})
    cmm_mvt: Double;

    @Column({ type: 'float', nullable: true})
    comm_ft_dcrt: Double;

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
        (banques: BanquesEntity) => banques.details,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    @JoinColumn({ name: 'banque_id', referencedColumnName: 'id' })
    banques: BanquesEntity;
}