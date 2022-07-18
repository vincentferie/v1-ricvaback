import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { CompteComptableOneEntity } from "../compte-compta-one/compte-compta-one.entity";
import { CompteComptableThreeEntity } from "../compte-compta-three/compte-compta-three.entity";

@Entity('admin_compte_comptable_two')
export class CompteComptableTwoEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    classe_one_id: string;

    @Column({ type: 'varchar', length: 2, nullable: true })
    ref: string;

    @Column({ type: 'smallint', unique: true })
    numero: number;

    @Column({ type: 'varchar', length: 150 })
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
    
    @ManyToOne(
        type => CompteComptableOneEntity,
        (levelOne: CompteComptableOneEntity) => levelOne.levelTwo,
        { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'}
    )
    @JoinColumn({ name: 'classe_one_id', referencedColumnName: 'id' })
    levelOne: CompteComptableOneEntity;

    @OneToMany(
        type => CompteComptableThreeEntity,
        (levelThree: CompteComptableThreeEntity) => levelThree.levelTwo,
        { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    levelThree: CompteComptableThreeEntity[];
}