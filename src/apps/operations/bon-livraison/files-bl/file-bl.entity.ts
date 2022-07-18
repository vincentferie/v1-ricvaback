import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BonLivraisonEntity } from '../bon-livraison.entity';

@Entity('admin_file_bl')
export class FileBlEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    bon_livraison_id: string;

    @Column({ type: 'varchar', unique: true })
    filename: string;

    @Column({ type: 'varchar' })
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
        type => BonLivraisonEntity,
        (bonLivraison: BonLivraisonEntity) => bonLivraison.filesbl,
        { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'}
    )
    @JoinColumn({ name: 'bon_livraison_id', referencedColumnName: 'id' })
    bonLivraison: BonLivraisonEntity;


}