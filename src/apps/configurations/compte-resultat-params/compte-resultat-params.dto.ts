import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { IsOptional, IsUUID, IsNotEmpty, IsDate, IsEnum, IsInt, IsString, MaxLength, MinLength, IsNumber, IsBoolean, IsNumberString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CompteResultatParamsDto {
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    id: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    ref: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(150)
    libelle: string;

    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    ordre: number;

    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()    
    @IsBoolean()
    total: boolean;

    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    operation: string;

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