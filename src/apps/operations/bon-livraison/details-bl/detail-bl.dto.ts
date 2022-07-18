import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { IsOptional, IsUUID, IsDate, IsEnum, IsInt, IsNumber, IsString, IsNumberString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
import { Double } from "typeorm";

export class DetailBlDto {
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    bon_livraison_id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    conteneur_id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    plomb_id: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    nbr_sacs: number;
  
    @ApiProperty({type: () => 'Double'})
    @IsNotEmpty()
    @IsNumber()
    gross_weight: Double;
  
    @ApiProperty({type: () => 'Double'})
    @IsNotEmpty()
    @IsNumber()
    tare: Double;
  
    @ApiProperty({type: () => 'Double'})
    @IsNotEmpty()
    @IsNumber()
    measurement: Double;

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