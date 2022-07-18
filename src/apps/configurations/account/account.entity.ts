import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { RoleEntity } from "src/apps/configurations/roles/role.entity";
import { ChargementEntity } from "src/apps/operations/chargements/chargement.entity";
import { LotEntity } from "src/apps/operations/lots/lot.entity";
import { ConteneurEntity } from "src/apps/operations/conteneur/conteneur.entity";
import { GroupementEntity } from "../groupement/groupement.entity";

@Entity('admin_account')
export class AccountEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid'})
    role_id: string;

    @Column({ type: 'uuid', nullable: true})
    groupement_id: string;

    @Column({ type: 'varchar', length: 50 })
    nom: string;

    @Column({ type: 'varchar', length: 150 })
    prenoms: string;

    @Column({ type: 'varchar', length: 30 })
    contact: string;

    @Column({ type: 'varchar', length: 150, unique: true, select: false  })
    username: string;

    @Column({ type: 'varchar', select: false  })
    password: string;

    @Column({ type: 'varchar', select: false })
    salt: string;

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }

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
        type => RoleEntity,
        (role: RoleEntity) => role.account,
        { nullable: false, primary: true, onUpdate: 'CASCADE'}
    )
    @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
    role: RoleEntity;

    @ManyToOne(
        type => GroupementEntity,
        (groupement: GroupementEntity) => groupement.account,
        { nullable: true, primary: true, onUpdate: 'CASCADE' }
        )
    @JoinColumn({ name: 'groupement_id', referencedColumnName: 'id' })
    groupement: GroupementEntity;

    @OneToMany(
        type => ChargementEntity,
        (chargements: ChargementEntity) => chargements.superviseur,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    chargements: ChargementEntity[];

    @OneToMany(
        type => LotEntity,
        (lots: LotEntity) => lots.superviseur,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    lots: LotEntity[];

    @OneToMany(
        type => ConteneurEntity,
        (conteneurs: ConteneurEntity) => conteneurs.superviseur,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    conteneurs: ConteneurEntity[];


}