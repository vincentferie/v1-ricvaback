import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Double, OneToMany } from "typeorm";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { ExportateursGroupementEntity } from "../exportateurs-groupement/exportateurs-groupement.entity";

@Entity('admin_information_exportateur')
export class InfosExportateurEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 150, unique: true })
    raison: string;

    @Column({ type: 'varchar', length: 150 })
    contribuable: string;

    @Column({ type: 'varchar', length: 30 })
    contact: string;

    @Column({ type: 'varchar', length: 150 })
    email: string;

    @Column({ type: 'varchar', length: 100 })
    postal: string;

    @Column({ type: 'varchar', length: 255 })
    lieu: string;

    @Column({ type: 'decimal', nullable: true })
    coord_x: Double;

    @Column({ type: 'decimal', nullable: true })
    coord_y: Double;

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
        type => ExportateursGroupementEntity,
        (groupExport: ExportateursGroupementEntity) => groupExport.exportateur,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    groupExport: ExportateursGroupementEntity[];

    // @OneToMany(
    //     type => EntrepotEntity,
    //     (entrepots: EntrepotEntity) => entrepots.exportateur,
    //     { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    // )
    // entrepots: EntrepotEntity[];

}