import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsNotEmpty, IsEnum, IsInt, IsDate, IsUUID, IsNumber, IsNumberString } from "class-validator";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";

export class RubriquesChargesDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  type_charge_id: string;
  
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  code_comptable: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
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
  mode: SoftDelete
} 