import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity('admin_refresh_token')
export class RefreshTokenEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid'})
    user_id: string;

    @Column({ type: 'boolean' })
    is_revoked: boolean;

    @Column({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
    expires: Date;

    @Column({ type: 'varchar' })
    token: string;

}