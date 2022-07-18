import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { JwtInfoGetter } from 'src/helpers/decorator/jwt-info-getter.decorator';
import { Roles } from 'src/helpers/decorator/role.decorator';
import { Role } from 'src/helpers/enums/role.enum';
import { SuiviActiviteService } from './suivi-activite.service';
@ApiTags('suivi-activite')
@Controller('suivi-activite')
@UseGuards(AuthGuard('jwt'))
@Roles(Role.Manager, Role.Financial, Role.Accounting, Role.Administrator, Role.Manager)
export class SuiviActiviteController {
    constructor(private readonly controllerService: SuiviActiviteService) {}

    @Get('repartitionLotTonnageSiteVille')
    async repartitionLotTonnageSiteVille(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.controllerService.repartitionLotTonnageSiteVille(findOption);
        return result;
    }

    @Get('evolutionNiveauStockJournalier')
    async evolutionNiveauStockJournalier(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.controllerService.evolutionNiveauStockJournalier(findOption);
        return result;
    }

    @Get('repartitionTonnageFonctionExportateurs')
    async repartitionTonnageFonctionExportateurs(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.controllerService.repartitionTonnageFonctionExportateurs(findOption);
        return result;
    }

    @Get('qualiteProduitsAnalyses')
    async qualiteProduitsAnalyses(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.controllerService.qualiteProduitsAnalyses(findOption);
        return result;
    }
    
    @Get('repartitionLots')
    async repartitionLots(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.controllerService.repartitionLots(findOption);
        return result;
    }
    
    @Get('repartitionLotsNonAnalyseEntrepot')
    async repartitionLotsNonAnalyseEntrepot(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.controllerService.repartitionLotsNonAnalyseEntrepot(findOption);
        return result;
    }


    @Get('repartitionLotsExportateurEntrepot')
    async repartitionLotsExportateurEntrepot(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.controllerService.repartitionLotsExportateurEntrepot(findOption);
        return result;
    }   

}
