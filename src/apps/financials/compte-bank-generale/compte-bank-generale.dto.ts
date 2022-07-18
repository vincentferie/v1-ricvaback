import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { IsOptional, IsUUID, IsNotEmpty, IsDate, IsEnum, IsInt, IsString, IsNumber, IsNumberString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { StateTirage } from "src/helpers/enums/state.enum";
import { Type } from "class-transformer";

export class CompteBankGeneraleDto {
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    campagne_id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    @IsString()
    groupement_id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    @IsString()
    banque_id: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    numero: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    solde: number;

    @ApiProperty()
    @IsDate()
    @IsOptional()
    @Type(()=> Date)
    date_tirage: Date;

    @ApiProperty()
    @IsOptional()
    @IsEnum(StateTirage)
    @IsInt()
    type: StateTirage;

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