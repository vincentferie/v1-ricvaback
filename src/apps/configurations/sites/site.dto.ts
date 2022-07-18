import { ApiProperty } from "@nestjs/swagger";
import {IsOptional,IsString, IsDate, IsEnum, IsInt, IsNotEmpty, IsUUID, IsNumber, IsNumberString} from "class-validator";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { Double } from "typeorm";

export class SiteDto {

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  ville_id: string;
 
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  libelle: string;

  @ApiProperty({type: () => 'Double'})
  @IsNumber()
  @IsOptional()
  superficie: Double;

  @ApiProperty({type: () => 'Double'})
  @IsNumber()
  @IsOptional()
  coordonneex: Double;

  @ApiProperty({type: () => 'Double'})
  @IsNumber()
  @IsOptional()
  coordonneey: Double;

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