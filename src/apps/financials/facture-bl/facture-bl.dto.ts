import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { IsOptional, IsUUID, IsNotEmpty, IsDate, IsEnum, IsInt, IsString, MaxLength, MinLength, IsNumber, IsNumberString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Double } from "typeorm";
import { Type } from "class-transformer";

export class FactureBlDto {
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
    client_id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    contrat_id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    bl_id: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(150)
    invoice: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(250)
    port_load: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(250)
    port_discharge: string;
    
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    total_container: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    total_bags: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    gross_weight: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    net_weight: number;
    
    @ApiProperty({type: () => 'double'})
    @IsNumber()
    @IsNotEmpty()
    qty_mts: Double;
    
    @ApiProperty({type: () => 'double'})
    @IsNumber()
    @IsNotEmpty()
    unit_price: Double;
        
    @ApiProperty({type: () => 'double'})
    @IsNumber()
    @IsNotEmpty()
    amount: Double;
            
    @ApiProperty({type: () => 'double'})
    @IsNumber()
    @IsNotEmpty()
    amount_chargeable_percent: Double;
            
    @ApiProperty({type: () => 'double'})
    @IsNumber()
    @IsNotEmpty()
    amount_chargeable: Double;
    
    @ApiProperty()
    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    date_contrat: Date;
    
    @ApiProperty()
    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    date_invoice: Date;

    @ApiProperty({type: () => 'File type for download Facture'})
    @IsOptional()
    bl: any;

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

