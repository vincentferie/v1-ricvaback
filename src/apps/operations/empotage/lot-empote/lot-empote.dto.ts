import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { IsOptional, IsUUID, IsDate, IsEnum, IsInt, IsNumber, IsString, IsNumberString } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
import { Double } from "typeorm";

export class LotEmpoteDto {
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    id: string;

    @ApiProperty()
    @IsUUID()
    empotage_id: string;
  
    @ApiProperty()
    @IsUUID()
    lot_id: string;

    @ApiProperty()
    @IsNumber()
    nbre_sacs: number;
  
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