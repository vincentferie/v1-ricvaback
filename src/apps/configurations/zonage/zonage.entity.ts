
import { ChargementEntity } from 'src/apps/operations/chargements/chargement.entity';
import { LotEntity } from 'src/apps/operations/lots/lot.entity';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('admin_zonage_params')
export class ZonageEntity extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100, unique: true})
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
        type => ChargementEntity,
        (chargements: ChargementEntity) => chargements.zonage,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    chargements: ChargementEntity[];

    @OneToMany(
        type => LotEntity,
        (lots: LotEntity) => lots.zonage,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    lots: LotEntity[];

}