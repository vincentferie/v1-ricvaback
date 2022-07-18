import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { ContratsEntity } from "src/apps/financials/contrats/contrats.entity";

@Entity('admin_incotems')
export class IncotemsEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', unique: true, length: 30 })
    libelle: string;

    @Column({ type: 'varchar', length: 150 })
    description: string;

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
        type => ContratsEntity,
        (contrat: ContratsEntity) => contrat.incotem,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    contrat: ContratsEntity[];

}