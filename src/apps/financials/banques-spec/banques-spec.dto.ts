import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { IsOptional, IsUUID, IsNotEmpty, IsNumber, IsDate, IsEnum, IsInt, IsString, MaxLength, IsEmpty, IsNumberString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { Double } from "typeorm";

export class BanquesSpecDto {
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    banque_id: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    ligne: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    montant: number;

    @ApiProperty({description: 'Currency Symbol: XOF, XAF, $ or € for example'})
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @MaxLength(10)
    currency: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    duree: number;

    @ApiProperty()
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    echeance: Date;

    @ApiProperty({ type: () => 'double'})
    @IsNumber()
    @IsOptional()
    taux: Double;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    hauteur_tirage: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    duree_tirage: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    compte_sequestre: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    frais_tirage: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    flat: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    libelle_garantie: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    depot_garantie: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    limite_garantie: number;

    @ApiProperty({ type: () => 'double'})
    @IsNumber()
    @IsOptional()
    frais_dossier: Double;

    @ApiProperty({ type: () => 'double'})
    @IsNumber()
    @IsOptional()
    frais_struct: Double;

    @ApiProperty({ type: () => 'double'})
    @IsNumber()
    @IsOptional()
    cmm_mvt: Double;

    @ApiProperty({ type: () => 'double'})
    @IsNumber()
    @IsOptional()
    comm_ft_dcrt: Double;

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
}
