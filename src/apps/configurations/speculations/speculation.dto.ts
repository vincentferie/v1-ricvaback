import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsNotEmpty, IsEnum, IsInt, IsDate, IsBoolean, IsUUID } from "class-validator";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { DetailsSpeculationDto } from "../details-speculation/detail-speculation.dto";

export class SpeculationDto {
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    id: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    libelle: string;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    @IsNotEmpty()
    usinage: boolean;

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

    @ApiProperty({type: () => DetailsSpeculationDto })
    @IsOptional()
    details: DetailsSpeculationDto;

} 