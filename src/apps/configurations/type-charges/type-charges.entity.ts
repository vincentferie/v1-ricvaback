import { ChargesEntity } from 'src/apps/comptabilite/charges/charges.entity';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import { RubriquesChargesEntity } from '../rubrique-charges/rubrique-charges.entity';

@Entity('admin_type_charges')
export class TypeChargesEntity extends BaseEntity  { 
	
    @PrimaryGeneratedColumn ('uuid')
    id : string;
    
    @Column({ type: 'int'})
    code_comptable: number;
    
    @Column ({ type: 'varchar', length: 150, unique: true  })
    libelle : string;

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
        type => ChargesEntity,
        (charges: ChargesEntity) => charges.typeCharge,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    charges: ChargesEntity[];

    @OneToMany(
        type => RubriquesChargesEntity,
        (rubrique: RubriquesChargesEntity) => rubrique.typeCharge,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    rubrique: RubriquesChargesEntity[];
}