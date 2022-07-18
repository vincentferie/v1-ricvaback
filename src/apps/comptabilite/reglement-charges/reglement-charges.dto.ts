import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { IsOptional, IsUUID, IsDate, IsEnum, IsInt, IsString, IsNumber, MinLength, MaxLength, IsNumberString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ReglementChargesDto {
    
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    charge_id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    banque_id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    type_charge_id: string;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    montant: number;

    @ApiProperty()
    @IsDate()
    @IsOptional()
    date_reglement: Date;

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

    @ApiProperty()
    @IsNumber()
    debit: number;

    @ApiProperty()
    @IsNumber()
    credit: number;

}