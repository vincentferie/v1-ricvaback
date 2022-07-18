import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { CompteComptableTwoEntity } from "../compte-compta-two/compte-compta-two.entity";
import { CompteComptableFourEntity } from "../compte-compta-four/compte-compta-four.entity";

@Entity('admin_compte_comptable_three')
export class CompteComptableThreeEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    classe_two_id: string;

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
        type => CompteComptableTwoEntity,
        (levelTwo: CompteComptableTwoEntity) => levelTwo.levelThree,
        { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'}
    )
    @JoinColumn({ name: 'classe_two_id', referencedColumnName: 'id' })
    levelTwo: CompteComptableTwoEntity;

    @OneToMany(
        type => CompteComptableFourEntity,
        (levelFour: CompteComptableFourEntity) => levelFour.levelThree,
        { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    levelFour: CompteComptableFourEntity[];
}