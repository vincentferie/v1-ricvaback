import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { IsOptional, IsUUID, IsNotEmpty, IsDate, IsEnum, IsInt, IsString, MaxLength, MinLength, IsNumber, IsNumberString, IsBoolean } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { StateEmpotage } from "src/helpers/enums/state.enum";
import { LotEmpoteDto } from "./lot-empote/lot-empote.dto";
import { Double } from "typeorm";

export class EmpotagesDto {
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    entrepot_id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    transitaire_id: string;
    
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    booking_id: string;
    
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    conteneur_id: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(150)
    ot: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    tare: number;

    @ApiProperty({type: ()=>'Double', description: 'Float type or Double type'})
    @IsNumber()
    @IsNotEmpty()
    out_turn: Double;

    @ApiProperty({type: () => [LotEmpoteDto]})
    @IsOptional()
    details: LotEmpoteDto[];

    @ApiProperty()
    @IsDate()
    @IsOptional()
    @Type(() => Date)
    date_empotage: Date;

    @ApiProperty()
    @IsOptional()
    @IsEnum(StateEmpotage)
    @IsInt()
    statut: StateEmpotage;

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