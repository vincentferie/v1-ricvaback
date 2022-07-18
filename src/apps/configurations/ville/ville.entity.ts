import { ChargementEntity } from 'src/apps/operations/chargements/chargement.entity';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SiteEntity } from '../sites/site.entity';

@Entity('admin_ville')
export class VilleEntity extends BaseEntity{

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200, unique: true })
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

  @OneToMany(
    type => SiteEntity,
    (sites: SiteEntity) => sites.ville,
    { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    sites: SiteEntity[];

    @OneToMany(
      type => ChargementEntity,
      (chargements: ChargementEntity) => chargements.provenance,
      { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    chargements: ChargementEntity[];

}