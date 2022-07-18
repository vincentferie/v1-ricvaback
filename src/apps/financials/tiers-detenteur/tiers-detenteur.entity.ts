import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { BaseEntity, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BanquesEntity } from "../banques/banques.entity";
import { NantissementEntity } from "../nantissement/nantissement.entity";

@Entity('admin_tier_detenteurs')
@Index("index_bank_tiere", ['banque_id', 'nom', 'prenoms'], { unique: true })
export class TierDetenteursEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'uuid'})
    banque_id: string;

    @Column({ type: 'varchar', length: 150})
    nom: string;

    @Column({ type: 'varchar', length: 150})
    prenoms: string;

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
        type => BanquesEntity,
        (banque: BanquesEntity) => banque.tierDetenteurs,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    @JoinColumn({ name: 'banque_id', referencedColumnName: 'id' })
    banque: BanquesEntity;

    @OneToMany(
        type => NantissementEntity,
        (nantissements: NantissementEntity) => nantissements.tierDetenteur,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    nantissements: NantissementEntity[];
}