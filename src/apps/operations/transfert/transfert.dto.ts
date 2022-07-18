import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { IsOptional, IsUUID, IsNotEmpty, IsDate, IsEnum, IsInt, IsString, MaxLength, MinLength, IsNumber, IsNumberString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class TransfertsDto {
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    lot_id: string;
    
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    site_provenance_id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    site_destination_id: string;

    @ApiProperty()
    @IsString()
    statutTriage: string;

    @ApiProperty()
    @IsNumber()
    poidsNetMq: number;

    @ApiProperty()
    @IsNumber()
    sacMq: number;

    @ApiProperty()
    @IsNumber()
    poidsNetDechet: number;

    @ApiProperty()
    @IsNumber()
    sacDechet: number;

    @ApiProperty()
    @IsNumber()
    poidsNetPoussiere: number;

    @ApiProperty()
    @IsNumber()
    totalSacTrie: number;

    @ApiProperty()
    @IsNumber()
    sacPoussiere: number;

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