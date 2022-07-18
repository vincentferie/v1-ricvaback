import { CampagneEntity } from "src/apps/configurations/campagne/campagne.entity";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { StateLots } from "src/helpers/enums/state.enum";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { NantissementEntity } from "../nantissement/nantissement.entity";

@Entity('admin_denantissement')
export class DenantissementEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid'})
    campagne_id: string;
    
    @Column({ type: 'uuid'})
    nantissement_id: string;

    @Column({ type: 'bigint'})
    montant: number;

    @Column({ type: 'bigint'})
    interet: number;

    @Column({ type: 'bigint'})
    fob: number;

    @Column({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP'})
    date_denantissement: Date;

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

    @OneToOne(
        type => NantissementEntity,
        (nantissement: NantissementEntity) => nantissement.denantissement,
        { nullable: false, primary: true, onUpdate: 'CASCADE',}
    )
    @JoinColumn({ name: 'nantissement_id', referencedColumnName: 'id' })
    nantissement: NantissementEntity;
    
    @ManyToOne(
        type => CampagneEntity,
        (campagne: CampagneEntity) => campagne.denantissement,
        { nullable: false, primary: true, onUpdate: 'CASCADE'}
    )
    @JoinColumn({ name: 'campagne_id', referencedColumnName: 'id' })
    campagne: CampagneEntity;


}