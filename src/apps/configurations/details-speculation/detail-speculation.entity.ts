import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from "typeorm";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { SpeculationEntity } from "../speculations/speculation.entity";

@Entity('admin_details_speculation')
export class DetailsSpeculationEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    speculation_id: string;

    @Column({ type: 'int' })
    poids_sac: number;

    @Column({ type: 'varchar', length: 10 })
    unite: string;

    @Column({ type: 'int' })
    nbr_sac: number;

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
        type => SpeculationEntity,
        (speculation: SpeculationEntity) => speculation.detailsSpeculation,
        { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn({ name: 'speculation_id', referencedColumnName: 'id' })
    // speculation: Promise<SpeculationEntity>;
    speculation: SpeculationEntity;
}