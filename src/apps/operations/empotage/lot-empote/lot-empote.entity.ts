import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { LotEntity } from "../../lots/lot.entity";
import { EmpotagesEntity } from "../empotage.entity";

@Entity('admin_lot_empote')
export class LotEmpoteEntity extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  empotage_id: string;

  @Column({ type: 'uuid' })
  lot_id: string;

  @Column({ type: 'integer' })
  nbre_sacs: number;

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
    type => EmpotagesEntity,
    (empotage: EmpotagesEntity) => empotage.LotEmpote,
    { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' }
  )
  @JoinColumn({ name: 'empotage_id', referencedColumnName: 'id' })
  empotage: EmpotagesEntity;

  @ManyToOne(
    type => LotEntity,
    (lot: LotEntity) => lot.lotEmpote,
    { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' }
  )
  @JoinColumn({ name: 'lot_id', referencedColumnName: 'id' })
  lot: LotEntity;

}