import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { IsOptional, IsUUID, IsDate, IsEnum, IsInt, IsString, IsNotEmpty, IsNumber, IsNumberString } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class BalanceDto {
    
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    id: string;

    @ApiProperty()
    @IsOptional()
    lot_id: string;

    @ApiProperty()
    @IsOptional()
    entrepot_id: string;
    
    @ApiProperty()
    @IsOptional()
    campagne_id: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    nbreSacs: number;
    
    @ApiProperty()
    @IsDate()
    @Type(() => Date)
    date: Date;

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