import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { IsOptional, IsUUID, IsNotEmpty, IsDate, IsEnum, IsInt, IsString, MaxLength, MinLength, IsNumber, IsNumberString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { CampagneSpecDto } from "../campagne-spec/campagne-spec.dto";
import { Type } from "class-transformer";
import { CampagneOutturnDto } from "./outturn/outturn.dto";
import { Double } from "typeorm";
export class CampagneDto {
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    speculation_id: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(150)
    libelle: string;

    @ApiProperty({type:() => 'Decimal; Double or float'})
    @IsOptional()
    @IsNumber()
    prix_bord: Double;

    @ApiProperty({type: () => Date })
    //@Transform(x => new Date(x))
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    ouverture: Date;

    @ApiProperty({ type: () => Date })
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    fermeture: Date;

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

    @ApiProperty({type: () => [CampagneSpecDto] })
    @IsOptional()
    details: CampagneSpecDto[];

    @ApiProperty({type: () => [CampagneOutturnDto] })
    @IsOptional()
    outturn: CampagneOutturnDto[];

}