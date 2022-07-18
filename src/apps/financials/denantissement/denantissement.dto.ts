import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { IsOptional, IsUUID, IsDate, IsEnum, IsInt, IsString, IsNumber, IsNumberString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { StateLots } from "src/helpers/enums/state.enum";

export class DenantissementDto {
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
    nantissement_id: string;

    @ApiProperty()
    @IsNumber()
    montant: number;

    @ApiProperty()
    @IsNumber()
    interet: number;

    @ApiProperty()
    @IsNumber()
    fob: number;

    @ApiProperty()
    @IsDate()
    @Type(() => Date)
    date_denantissement: Date;

    @ApiProperty({description: 'Enum type', enum: () => StateLots})
    @IsOptional()
    @IsInt()
    @IsEnum(StateLots)
    statut: StateLots;

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