import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TicketRelevageEntity } from "../ticket-relevage.entity";

@Entity('admin_file_ticket_relevage')
export class FileTicketRelevageEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    ticket_relevage_id: string;

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
        type => TicketRelevageEntity,
        (ticket: TicketRelevageEntity) => ticket.fileTicket,
        { nullable: false, primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn({ name: 'ticket_relevage_id', referencedColumnName: 'id' })
    ticket: TicketRelevageEntity;


}