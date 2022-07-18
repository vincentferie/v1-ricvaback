import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsNotEmpty, IsEnum, IsInt, IsDate, IsUUID, IsDecimal } from "class-validator";
import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { Double } from "typeorm";

export class InfosExportateurDto {
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    id: string;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    raison: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    contribuable: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    contact: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    postal: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lieu: string;

    @ApiPropertyOptional({ type: () => 'double' })
    @IsDecimal()
    @IsOptional()
    coord_x: Double;

    @ApiPropertyOptional({ type: () => 'double' })
    @IsDecimal()
    @IsOptional()
    coord_y: Double;

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