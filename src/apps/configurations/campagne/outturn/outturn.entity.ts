import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { BaseEntity, Column, Double, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CampagneEntity } from "../campagne.entity";

@Entity('admin_campagne_outturn')
export class CampagneOutturnEntity extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  campagne_id: string;

  @Column({ type: 'float' })
  min_outtrun: Double;

  @Column({ type: 'float' })
  max_outtrun: Double;

  @Column({ type: 'char', length: 4, nullable: true})
  flag: string;

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
    type => CampagneEntity,
    (campagne: CampagneEntity) => campagne.outturn,
    { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'}
  )
  @JoinColumn({ name: 'campagne_id', referencedColumnName: 'id' })
  campagne: CampagneEntity;

}