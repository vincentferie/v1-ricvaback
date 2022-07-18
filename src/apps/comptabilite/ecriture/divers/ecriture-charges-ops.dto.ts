import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { IsOptional, IsUUID, IsDate, IsEnum, IsInt, IsNotEmpty, IsNumber, IsNumberString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class EcritureChargesDiversesDto {
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    id: string;

    @ApiProperty()
    @IsUUID()
    @IsOptional()
    charge_ops_id: string;

    @ApiProperty()
    @IsUUID()
    @IsOptional()
    reglement_ops_charge_id: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    debit: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    credit: number;
 
    @ApiProperty()
    @IsDate()
    @IsOptional()
    created: Date;

    @ApiProperty()
    @IsDate()
    @IsOptional()
    updated: Date;

    @ApiProperty()
    @IsOptional()
    @IsEnum(SoftDelete)
    @IsInt()
    mode: SoftDelete;

}