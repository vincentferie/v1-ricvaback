import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { IsOptional, IsUUID, IsNotEmpty, IsNumber, IsDate, IsEnum, IsInt, IsString, IsNumberString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Double } from "typeorm";

export class CampagneSpecDto {
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    campagne_id: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    libelle: string;

    @ApiProperty({type:() => 'Float or Double value'})
    @IsNumber()
    @IsOptional()
    @IsNotEmpty()
    valeur: Double;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    tag: string;

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