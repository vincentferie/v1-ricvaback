import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { IsOptional, IsUUID, IsNotEmpty, IsNumber, IsDate, IsEnum, IsInt, IsString, IsNumberString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class DetailsSpeculationDto {
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    speculation_id: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    poids_sac: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    unite: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    nbr_sac: number;

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