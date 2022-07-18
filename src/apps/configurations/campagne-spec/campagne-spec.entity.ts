import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, Double } from "typeorm";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { CampagneEntity } from "../campagne/campagne.entity";

@Entity('admin_campagne_spec')
export class CampagneSpecEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    campagne_id: string;

    @Column({ type: 'varchar', length: 150, unique: true })
    libelle: string;

    @Column({ type: 'decimal' })
    valeur: Double;

    @Column({ type: 'varchar', length: 10 })
    tag: string;

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
        (campagne: CampagneEntity) => campagne.detailsCampagne,
        { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn({ name: 'campagne_id', referencedColumnName: 'id' })
    campagne: CampagneEntity;
}