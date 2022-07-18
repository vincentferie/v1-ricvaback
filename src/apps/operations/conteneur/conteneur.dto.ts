import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { IsOptional, IsUUID, IsDate, IsEnum, IsInt, IsString, IsNumber, IsNumberString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class ConteneursDto {
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    booking_id: string;
  
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    superviseur_id: string;

    @ApiProperty()
    @IsString()
    numero: string;

    @ApiProperty()
    @IsString()
    type_tc: string;

    @ApiProperty()
    @IsNumber()
    capacite: number;

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