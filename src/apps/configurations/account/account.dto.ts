import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { IsOptional, IsUUID, IsNotEmpty, IsDate, IsEnum, IsInt, IsString, MaxLength, MinLength, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AccountDto {
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    id: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    role_id: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    nom: string;

    @ApiProperty()
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(150)
    prenoms: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(30)
    contact: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @MinLength(5)
    @MaxLength(100)
    username: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @MinLength(8)
    @MaxLength(150)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Faible mot de passe. Variez les caractères(A;a;#;1).' })
    password: string;

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