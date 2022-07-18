import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { IsOptional, IsUUID, IsDate, IsEnum, IsInt, IsString, IsNumber, MinLength, MaxLength, IsNumberString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ChargesDto {
    
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    fournisseur_id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    type_charge_id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    site_id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    bl_id: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    num_ordre: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    num_facture: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @MinLength(5)
    @MaxLength(150)
    libelle: string;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    montant_ht: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    montant_tva: number;

    @ApiProperty()
    @IsDate()
    @IsOptional()
    date_facture: Date;

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

    @ApiProperty()
    @IsNumber()
    debit: number;

    @ApiProperty()
    @IsNumber()
    credit: number;
}