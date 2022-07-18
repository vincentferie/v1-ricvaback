import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { IsOptional, IsUUID, IsNotEmpty, IsDate, IsEnum, IsInt, IsString, MaxLength, MinLength, IsNumber, IsNumberString, IsBoolean } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class TicketRelevageDto {
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    exportateur_id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    campagne_id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    speculation_id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    booking_id: string;
    
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    conteneur_id: string;
    
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    plomb_id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    transitaire_id: string;
    
    @ApiProperty()
    @IsString()
    code_pesee: string;

    @ApiProperty()
    @IsString()
    booking_ticket: string;

    @ApiProperty()
    @IsString()
    compagnie_maritime: string;

    @ApiProperty()
    @IsNumber()
    first_weighing: number;

    @ApiProperty()
    @IsDate()
    date_first_weighing: Date;

    @ApiProperty()
    @IsString()
    hour_first_weighing: string;

    @ApiProperty()
    @IsNumber()
    second_weighing: number;

    @ApiProperty()
    @IsDate()
    @IsOptional()
    date_second_weighing: Date;

    @ApiProperty()
    @IsString()
    hour_second_weighing: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    poids_declare: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    poids_net: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    poids_vgm: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    nbr_emb: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    tare_emb: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    tare_pal: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    tare_cnt: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    tare_hab: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    tare_cnt2: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    metode_controle_vgm: string;

    @ApiProperty()
    @IsString()
    provenance: string;

    @ApiProperty()
    @IsString()
    destination: string;

    @ApiProperty()
    @IsString()
    chauffeur: string;

    @ApiProperty()
    @IsString()
    navire: string;

    @ApiProperty()
    @IsString()
    port_embarquement: string;

    @ApiProperty()
    @IsString()
    destination_navire: string;

    @ApiProperty()
    @IsString()
    magazin: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    num_contrat: string;
    
    @ApiProperty()
    @IsString()
    @IsOptional()
    num_connaissement: string;
    
    @ApiProperty()
    @IsString()
    @IsOptional()
    num_lot: string;
    
    @ApiProperty()
    @IsString()
    @IsOptional()
    num_livraison: string;
    
    @ApiProperty()
    @IsString()
    @IsOptional()
    num_dossier: string;
    
    @ApiProperty()
    @IsString()
    @IsOptional()
    num_bord: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    tracteur: string;
    
    @ApiProperty()
    @IsString()
    @IsOptional()
    remorque: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    peseur: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    agent_cci: string;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    validity: boolean;

    @ApiProperty()
    @IsDate()
    @IsOptional()
    created: Date;

    @ApiProperty()
    @IsDate()
    @IsOptional()
    updated: Date;
    
    @ApiProperty()
    @IsString()
    @IsOptional()
    created_by: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    updated_by: string;
    
    @ApiProperty()
    @IsOptional()
    @IsEnum(SoftDelete)
    @IsInt()
    mode: SoftDelete;

    @ApiProperty({type: () => 'File of ticket de relevage'})
    @IsOptional()
    file: any;
}