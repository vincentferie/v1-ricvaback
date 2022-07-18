import { LotEntity } from "src/apps/operations/lots/lot.entity";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { NantissementEntity } from "../nantissement.entity";

@Entity('admin_lots_nantis')
export class LotsNantisEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid'})
    nantissement_id: string;

    @Column({ type: 'uuid'})
    lot_id: string;

    @Column({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP'})
    date_nantissement: Date;

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
        type => NantissementEntity,
        (nantissement: NantissementEntity) => nantissement.lotsNantis,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    @JoinColumn({ name: 'nantissement_id', referencedColumnName: 'id' })
    nantissement: NantissementEntity;

    @ManyToOne(
        type => LotEntity,
        (lot: LotEntity) => lot.lotsNantis,
        { nullable: false, primary: true, onUpdate: 'CASCADE'}
    )
    @JoinColumn({ name: 'lot_id', referencedColumnName: 'id' })
    lot: LotEntity;

}