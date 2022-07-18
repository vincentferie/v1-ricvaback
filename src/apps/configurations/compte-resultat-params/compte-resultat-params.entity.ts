import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { CompteResultatPosteEntity } from "../compte-resultat-poste/compte-resultat-poste.entity";

@Entity('admin_compte_resultat_params')
export class CompteResultatParamsEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 2, nullable: true })
    ref: string;

    @Column({ type: 'varchar', length: 150 })
    libelle: string;

    @Column({ type: 'smallint' })
    ordre: number;

    @Column({ type: 'boolean' })
    total: boolean;

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
        type => CompteResultatPosteEntity,
        (poste: CompteResultatPosteEntity) => poste.compte,
        { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    poste: CompteResultatPosteEntity[];

}