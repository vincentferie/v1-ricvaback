import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { BaseEntity, Column, Double, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ConteneurEntity } from "../../conteneur/conteneur.entity";
import { PlombEntity } from "../../plomb/plomb.entity";
import { BonLivraisonEntity } from "../bon-livraison.entity";

@Entity('admin_detail_bl')
export class DetailBlEntity extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  bon_livraison_id: string;

  @Column({ type: 'uuid' })
  conteneur_id: string;

  @Column({ type: 'uuid' })
  plomb_id: string;

  @Column({ type: 'int' })
  nbr_sacs: number;

  @Column({ type: 'float' })
  gross_weight: Double;

  @Column({ type: 'float' })
  tare: Double;

  @Column({ type: 'float' })
  measurement: Double;

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
    type => ConteneurEntity,
    (conteneur: ConteneurEntity) => conteneur.detailBls,
    { nullable: false, primary: true, onUpdate: 'CASCADE', eager: true}
  )
  @JoinColumn({ name: 'conteneur_id', referencedColumnName: 'id' })
  conteneur: ConteneurEntity;

  @OneToOne(
    type => PlombEntity,
    (plomb: PlombEntity) => plomb.detailBl,
    { nullable: false, primary: true, onUpdate: 'CASCADE', eager: true}
  )
  @JoinColumn({ name: 'plomb_id', referencedColumnName: 'id' })
  plomb: PlombEntity;

  @ManyToOne(
    type => BonLivraisonEntity,
    (bonLivraison: BonLivraisonEntity) => bonLivraison.details,
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  @JoinColumn({ name: 'bon_livraison_id', referencedColumnName: 'id' })
  bonLivraison: BonLivraisonEntity;
}