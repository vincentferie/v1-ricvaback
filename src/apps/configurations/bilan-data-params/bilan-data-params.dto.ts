import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { IsOptional, IsUUID, IsNotEmpty, IsDate, IsEnum, IsInt, IsString, MaxLength, MinLength, IsBoolean, IsNumber, IsNumberString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class BilanDataParamsDto {
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    bilan_params_id: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(2)
    ref: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(150)
    libelle: string;

    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    total: boolean;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    ordre: number;

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