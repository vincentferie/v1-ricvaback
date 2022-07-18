import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { IsOptional, IsUUID, IsDate, IsEnum, IsInt, IsString, IsNumber, IsNumberString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
import { DetailBlDto } from './details-bl/detail-bl.dto';
import { Type } from "class-transformer";

export class BonLivraisonDto {

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    groupement_id: string;
  
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    numero_voyage: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    numero_bl: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    destination: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    provenance: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    amateur: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    nom_client: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    adresse_client: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    pays_client: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    port_depart: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    port_arrive: string;

    @ApiProperty()
    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    date_embarquement: Date;

    @ApiProperty({type: () => [DetailBlDto]})
    @IsOptional()
    details: DetailBlDto[];

    @ApiProperty({description: 'Bl File',})
    @IsOptional()
    file: any;

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