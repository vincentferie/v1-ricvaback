import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { IsOptional, IsUUID, IsDate, IsEnum, IsInt, IsString, MaxLength, IsNumber, IsNumberString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { StateLots } from "src/helpers/enums/state.enum";
import { LotsNantisDto } from "./lots-nantis/lots-nantis.dto";

export class NantissementDto {
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
    banque_id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    tiers_id: string;

    @ApiProperty()
    @IsString()
    @MaxLength(300)
    numero_lettre: string;

    @ApiProperty()
    @IsNumber()
    montant: number;

    @ApiProperty()
    @IsDate()
    @Type(() => Date)
    date_nantissement: Date;

    @ApiProperty({description: 'Enum type', enum: () => StateLots})
    @IsOptional()
    @IsInt()
    @IsEnum(StateLots)
    statut: StateLots;

    @ApiProperty({type: () => [LotsNantisDto]})
    @IsOptional()
    lots: LotsNantisDto[];

    @ApiProperty({description: 'File for "lettre de detention"'})
    @IsOptional()
    lettre: any;

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