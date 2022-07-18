import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { JwtInfoGetter } from 'src/helpers/decorator/jwt-info-getter.decorator';
import { Roles } from 'src/helpers/decorator/role.decorator';
import { Role } from 'src/helpers/enums/role.enum';
import { RapportExportateurService } from './rapport-exportateur.service';

@ApiTags('rapport-exportateur')
@Controller('rapport-exportateur')
@UseGuards(AuthGuard('jwt'))
@Roles(Role.Manager, Role.Operator, Role.Manager)
export class RapportExportateurController {
    constructor(private readonly controllerService: RapportExportateurService) {}

    @Get('repartitionLotTonnageSite')
    async repartitionLotTonnageSite(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.controllerService.repartitionLotTonnageSite(findOption);
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

    @Get('inventaireLotsExportateur')
    async inventaireLotsExportateur(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.controllerService.inventaireLotsExportateur(findOption);
        return result;
    }
    
}
