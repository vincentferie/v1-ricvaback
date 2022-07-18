import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { IsOptional, IsUUID, IsDate, IsEnum, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
import { StateBooking } from "src/helpers/enums/state.enum";
export class BookingDto {

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    id: string;

    @ApiProperty()
    @IsString()
    numero_reel: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    numero_change: string;

    @ApiProperty()
    @IsOptional()
    @IsEnum(StateBooking)
    @IsInt()
    state: StateBooking;

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