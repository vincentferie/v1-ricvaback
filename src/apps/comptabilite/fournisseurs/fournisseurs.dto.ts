import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { IsOptional, IsUUID, IsDate, IsEnum, IsInt, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class FournisseursDto {
    
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    transitaire_id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    client_id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    exportateur_id: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    code: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    raison_social: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    denomination: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    localisation: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    activite: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    contact: string;

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