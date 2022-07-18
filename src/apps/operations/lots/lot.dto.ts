import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { IsOptional, IsUUID, IsDate, IsEnum, IsInt, IsString, IsNumberString, IsBoolean, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { StateLots } from "src/helpers/enums/state.enum";
import { Type } from "class-transformer";

export class LotsDto {
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    superviseur_id: string;
    
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    campagne_id: string;
    
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    site_id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    entrepot_id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    exportateur_id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    speculation_id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    chargement_id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    zonage_id: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    numero_ticket_pese: number;
    
    @ApiProperty()
    @IsString()
    @IsOptional()
    code_dechargement: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    numero_lot: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    sac_en_stock: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    premiere_pesee: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    deuxieme_pesee: number;
  
    @ApiProperty()
    @IsNumber()
    @IsOptional()
    reconditionne: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    tare_emballage_refraction: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    poids_net: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    sacs_decharge: number;

    @ApiProperty()
    @IsDate()
    @Type(()=> Date)
    @IsOptional()
    date_dechargement: Date;

    @ApiProperty()
    @IsOptional()
    @IsEnum(StateLots)
    @IsInt()
    statut: StateLots;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    validity: boolean;

    @ApiProperty()
    @IsString()
    @IsOptional()
    created_by: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    updated_by: string;

    @ApiProperty()
    @IsDate()
    @IsOptional()
    created: Date;

    @ApiProperty()
    @IsDate()
    @IsOptional()
    updated: Date;

    @ApiProperty()
    @IsOptional()
    @IsEnum(SoftDelete)
    @IsInt()
    mode: SoftDelete;

    @ApiProperty({type: () => 'File of ticket de pesée'})
    @IsOptional()
    file: any

}