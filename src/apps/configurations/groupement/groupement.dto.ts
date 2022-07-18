import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { IsOptional, IsUUID, IsNotEmpty, IsDate, IsEnum, IsInt, IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PersonanlisationDto } from "./personnalisation/personnalisation.dto";

export class GroupementDto {
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    id: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(150)
    libelle: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    contribuable: string;

    @ApiProperty()
    @IsString()
    contact: string;

    @ApiProperty()
    @IsString()
    email: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    postal: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    lieu: string;

    @ApiProperty({ type: () => 'File' })
    @IsOptional()
    logo: any;

    @ApiProperty({ type: () => PersonanlisationDto })
    @IsOptional()
    personnalisation: PersonanlisationDto;

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