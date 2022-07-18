import { ChargesEntity } from "src/apps/comptabilite/charges/charges.entity";
import { TypeChargesEntity } from "src/apps/configurations/type-charges/type-charges.entity";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
@Entity('admin_rubriques_charges')
export class RubriquesChargesEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid'})
    type_charge_id: string;

    @Column({ type: 'varchar', unique: true, length: 150})
    libelle: string;

    @Column({ type: 'int'})
    code_comptable: number;
    
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
        type => TypeChargesEntity,
        (typeCharge: TypeChargesEntity) => typeCharge.rubrique,
        { nullable: false, primary: true, onUpdate: 'CASCADE'}
    )
    @JoinColumn({ name: 'type_charge_id', referencedColumnName: 'id' })
    typeCharge: TypeChargesEntity;

    @OneToMany(
        type => ChargesEntity,
        (charges: ChargesEntity) => charges.rubrique,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    charges: ChargesEntity[];
}