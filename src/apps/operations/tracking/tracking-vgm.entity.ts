import { CampagneEntity } from 'src/apps/configurations/campagne/campagne.entity';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';

@Entity('admin_tracking_vgm')
export class TrackingVgmEntity extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar' })
    campagne_id: string;

    @Column({ type: 'varchar', nullable: true })
    job_id: string | number;
    
    @Column({ type: 'varchar', nullable: true })
    job_name: string;

    @Column({ type: 'varchar' })
    conteneur: string;
    
    @Column({ type: 'varchar', nullable: true })
    booking: string;
    
    @Column({ type: 'varchar', nullable: true })
    ligne_maritime: string;
    
    @Column({ type: 'int', nullable: true })
    poids: number;
    
    @Column({ type: 'varchar', nullable: true })
    pont_bascule: string;
    
    @Column({ type: 'varchar', nullable: true })
    edition: string;
    
    @Column({ type: 'varchar', nullable: true })
    emission: string;
    
    @Column({ type: 'boolean', default: false })
    statut: boolean;

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
        (campagne: CampagneEntity) => campagne.trackingVgm,
        { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' }
      )
      @JoinColumn({ name: 'campagne_id', referencedColumnName: 'id' })
      campagne: CampagneEntity;

}