import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from "typeorm";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { AccountEntity } from "../account/account.entity";

@Entity('admin_role')
export class RoleEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 150, unique: true })
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
        type => AccountEntity,
        (account: AccountEntity) => account.role,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    account: AccountEntity[];

}