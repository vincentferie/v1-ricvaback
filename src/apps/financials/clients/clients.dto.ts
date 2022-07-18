import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { IsOptional, IsUUID, IsNotEmpty, IsDate, IsEnum, IsInt, IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ClientsDto {
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    id: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @MinLength(2)
    @MaxLength(150)
    buyer: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @MinLength(2)
    @MaxLength(300)
    adresse: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @MinLength(8)
    @MaxLength(30)
    telephone: string; 

    @ApiProperty()
    @IsString()
    @IsOptional()
    @MinLength(10)
    @MaxLength(150)
    email: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @MinLength(5)
    @MaxLength(150)
    representer: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @MinLength(2)
    @MaxLength(150)
    bank: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @MinLength(2)
    @MaxLength(150)
    adresse_bank: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @MinLength(2)
    @MaxLength(150)
    swift_code: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @MinLength(2)
    @MaxLength(150)
    numero_compte: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @MinLength(2)
    @MaxLength(150)
    nom_compte: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @MinLength(2)
    @MaxLength(150)
    bank_correspondant: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @MinLength(2)
    @MaxLength(150)
    corres_swift_code: string;

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

