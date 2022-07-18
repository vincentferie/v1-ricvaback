import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { GroupementEntity } from "../groupement.entity";

@Entity('admin_personnalisation')
export class PersonanlisationEntity extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid'})
  groupement_id: string;

  @Column({ type: 'varchar', length: 10 })
  main_color: string;

  @Column({ type: 'varchar', length: 10 })
  sub_color: string;

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
    type => GroupementEntity,
    (groupement: GroupementEntity) => groupement.perso,
    { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'}
  )
  @JoinColumn({ name: 'groupement_id', referencedColumnName: 'id' })
  groupement: GroupementEntity;

}