import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { IsOptional, IsUUID, IsDate, IsEnum, IsInt, IsNumber, IsString, IsNumberString } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
import { Double } from "typeorm";

export class CampagneOutturnDto {
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    campagne_id: string;

    @ApiProperty({type: ()=>'Double', description: 'Float type or Double type'})
    @IsOptional()
    @IsNumber()
    min_outtrun: Double;

    @ApiProperty({type: ()=>'Double', description: 'Float type or Double type'})
    @IsOptional()
    @IsNumber()
    max_outtrun: Double;

    @ApiProperty()
    @IsOptional()
    @IsString()
    flag: string;

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