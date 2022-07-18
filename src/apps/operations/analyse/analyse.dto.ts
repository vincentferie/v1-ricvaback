import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { IsOptional, IsUUID, IsNotEmpty, IsDate, IsEnum, IsInt, IsNumber, IsString, IsNumberString } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
import { Double } from "typeorm";

export class AnalysesDto {
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    id: string;

    @ApiProperty()
    @IsOptional()
    lot_id: string;

    @ApiProperty({type: ()=>'Double', description: 'Float type or Double type'})
    @IsNumber()
    @IsNotEmpty()
    out_turn: Double;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    grainage: number;

    @ApiProperty({type: ()=>'Double', description: 'Float type or Double type'})
    @IsNumber()
    @IsNotEmpty()
    th: Double;
    
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