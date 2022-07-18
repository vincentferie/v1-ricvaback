import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { BaseEntity, Column, Double, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { LotEntity } from "../lots/lot.entity";
@Entity('admin_analyse')
export class AnalysesEntity extends BaseEntity {
  
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  lot_id: string;

  @Column({ type: 'float' })
  th: Double;

  @Column({ type: 'int' })
  grainage: number;
  
  @Column({ type: 'float' })
  out_turn: Double;

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
    type => LotEntity,
    (lots: LotEntity) => lots.analyses,
    { nullable: false, primary: true, onUpdate: 'CASCADE'}
  )
  @JoinColumn({ name: 'lot_id', referencedColumnName: 'id' })
  lots: LotEntity;

}