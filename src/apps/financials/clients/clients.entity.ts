import { FournisseursEntity } from "src/apps/comptabilite/fournisseurs/fournisseurs.entity";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { BaseEntity, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ContratsEntity } from "../contrats/contrats.entity";
import { FactureBlEntity } from "../facture-bl/facture-bl.entity";

@Entity('admin_clients')
export class ClientsEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 150, unique: true})
    buyer: string;

    @Column({ type: 'varchar', length: 300, nullable: true})
    adresse: string;

    @Column({ type: 'varchar', length: 30, nullable: true})
    telephone: string;

    @Column({ type: 'varchar', length: 150, nullable: true})
    email: string;

    @Column({ type: 'varchar', length: 150, nullable: true})
    representer: string;

    @Column({ type: 'varchar', length: 150, nullable: true})
    bank: string;

    @Column({ type: 'varchar', length: 150, nullable: true})
    adresse_bank: string;

    @Column({ type: 'varchar', length: 150, nullable: true})
    swift_code: string;

    @Column({ type: 'varchar', length: 150, nullable: true})
    numero_compte: string;

    @Column({ type: 'varchar', length: 150, nullable: true})
    nom_compte: string;

    @Column({ type: 'varchar', length: 150, nullable: true})
    bank_correspondant: string;

    @Column({ type: 'varchar', length: 150, nullable: true})
    corres_swift_code: string;

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
        type => ContratsEntity,
        (contrats: ContratsEntity) => contrats.client,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    contrats: ContratsEntity[];

    @OneToMany(
        type => FactureBlEntity,
        (factures: FactureBlEntity) => factures.client,
        { nullable: false, primary: true, onUpdate: 'CASCADE' }
    )
    factures: FactureBlEntity[];

    @OneToOne(
        type => FournisseursEntity,
        (fournisTransit: FournisseursEntity) => fournisTransit.client,
        { nullable: true, primary: true, onUpdate: 'CASCADE' }
    )
    fournisTransit: FournisseursEntity;

}