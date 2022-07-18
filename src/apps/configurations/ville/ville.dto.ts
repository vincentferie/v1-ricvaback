import { ApiProperty } from "@nestjs/swagger";
import {IsOptional,IsString, IsDate, IsEnum, IsInt, IsNotEmpty, IsUUID} from "class-validator";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";

export class VilleDto {

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: string;
 
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  libelle: string;
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