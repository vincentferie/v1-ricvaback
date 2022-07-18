import { SoftDelete } from "src/helpers/enums/softdelete.enum";
import { IsOptional, IsUUID, IsDate, IsEnum, IsInt, IsString, IsBoolean } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { StateChargement } from "src/helpers/enums/state.enum";

export class ChargementsDto {
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    id: string;

    @ApiProperty()
    @IsUUID()
    @IsOptional()
    superviseur_id: string;
    
    @ApiProperty()
    @IsUUID()
    campagne_id: string;
    
    @ApiProperty()
    @IsUUID()
    provenance_id: string;
    
    @ApiProperty()
    @IsUUID()
    zonage_id: string;
    
    @ApiProperty()
    @IsUUID()
    exportateur_id: string;
    
    @ApiProperty()
    @IsUUID()
    entrepot_id: string;

    @ApiProperty()
    @IsUUID()
    speculation_id: string;

    @ApiProperty()
    @IsString()
    num_fiche: string;
  
    @ApiProperty()
    @IsDate()
    @Type(()=> Date)
    date_chargement: Date;
  
    @ApiProperty()
    @IsString()
    tracteur: string;
  
    @ApiProperty()
    @IsString()
    remorque: string;
  
    @ApiProperty()
    @IsString()
    fournisseur: string;
  
    @ApiProperty()
    @IsString()
    contact_fournisseur: string;
  
    @ApiProperty()
    @IsString()
    transporteur: string;

    @ApiProperty()
    @IsOptional()
    @IsEnum(StateChargement)
    @IsInt()
    statut: StateChargement;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    validity: boolean;  

    @ApiProperty({description: 'Fiche de Transfert File'})
    @IsOptional()
    @IsString()
    file: any;

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