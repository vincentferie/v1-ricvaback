import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { IsOptional, IsUUID, IsNotEmpty, IsDate, IsEnum, IsInt, IsString, MaxLength, MinLength, IsNumber, IsNumberString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Double } from "typeorm";

export class ReglementsFactureBlDto {
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
    facture_bl_id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    banque_id: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(10)
    currency: string;

    @ApiProperty({type: () => 'double'})
    @IsNumber()
    @IsNotEmpty()
    currency_value: Double;

    @ApiProperty({type: () => 'double'})
    @IsNumber()
    @IsNotEmpty()
    amount: Double;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(250)
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

}

