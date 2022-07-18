import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { IsOptional, IsUUID, IsNotEmpty, IsDate, IsEnum, IsInt, IsString, MaxLength, MinLength, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Double } from "typeorm";
import { Type } from "class-transformer";

export class ContratsDto {
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

    @ApiProperty({description: 'Represent SHIPMENT TERMS'})
    @IsOptional()
    @IsUUID()
    incotem_id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    groupement_id: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(150)
    code: string;

    @ApiProperty({type:() =>'Double',description: 'MTS type double'})
    @IsNumber()
    @IsNotEmpty()
    quantity_value: Double;

    @ApiProperty({type:() =>'Double',description: 'ALLOWED percent part double'})
    @IsNumber()
    @IsNotEmpty()
    quantity_percent_min_max: Double;

    @ApiProperty({type:() =>'Double',description: 'LBS AND ABOVE PER 80KG BAG double'})
    @IsNumber()
    @IsNotEmpty()
    outturn: Double;

    @ApiProperty({type:() =>'Double',description: 'NUTS/KG MAX double'})
    @IsNumber()
    @IsNotEmpty()
    nutcount: Double;

    @ApiProperty({type:() =>'Double',description: 'Percent MAX double'})
    @IsNumber()
    @IsNotEmpty()
    moisture: Double;

    @ApiProperty({type:() =>'Double',description: 'Percent Max double'})
    @IsNumber()
    @IsNotEmpty()
    foreign_matter: Double;

    @ApiProperty({type:() =>'Double',description: 'USD/MT $ : double'})
    @IsNumber()
    @IsNotEmpty()
    price: Double;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(600)
    discount: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(600)
    rejection: string;

    @ApiProperty({type:() =>'Double',description: 'Deposit is a percent : double'})
    @IsNumber()
    @IsNotEmpty()
    payment_deposit: Double;

    @ApiProperty({type:() =>'Double',description: 'Shipped is a percent : double'})
    @IsNumber()
    @IsNotEmpty()
    payment_shipped: Double;

    @ApiProperty()
    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    signature: Date;

    @ApiProperty({type: () => 'File type for download contrat'})
    @IsOptional()
    contrat: any;

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

