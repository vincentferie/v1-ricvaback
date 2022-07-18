import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ContratsEntity } from "../contrats.entity";

@Entity('admin_file_contrat')
export class FileContratEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid'})
    contrat_id: string;

    @Column({ type: 'varchar', unique: true})
    filename: string;

    @Column({ type: 'varchar'})
    path: string;

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
        type => ContratsEntity,
        (contrat: ContratsEntity) => contrat.file,
        { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE', eager: true}
    )
    @JoinColumn({ name: 'contrat_id', referencedColumnName: 'id' })
    contrat: ContratsEntity;


}