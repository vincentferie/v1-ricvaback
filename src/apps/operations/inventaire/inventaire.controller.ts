import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { JwtInfoGetter } from 'src/helpers/decorator/jwt-info-getter.decorator';
import { Roles } from 'src/helpers/decorator/role.decorator';
import { Role } from 'src/helpers/enums/role.enum';
import { InventaireService } from './inventaire.service';
@ApiTags('inventaire')
@Controller('inventaire')
@UseGuards(AuthGuard('jwt'))
@Roles(Role.Manager, Role.Operator, Role.Manager)
export class InventaireController {

    constructor(private readonly controllerService: InventaireService) { }

    @Get('etatLotsAnalyseDetailles')
    async etatLotsAnalyseDetailles(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.controllerService.etatLotsAnalyseDetailles(findOption);
        return result;
    }

    @Get('etatLotsAnalyseGenerale')
    async etatLotsAnalyseGenerale(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.controllerService.etatLotsAnalyseGenerale(findOption);
        return result;
    }

    @Get('etatLotsAnalyseNantis')
    async etatLotsAnalyseNantis(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.controllerService.etatLotsAnalyseNantis(findOption);
        return result;
    }

    @Get('etatStatutLotsAnalyse')
    async etatStatutLotsAnalyse(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.controllerService.etatStatutLotsAnalyse(findOption);
        return result;
    }

    @Get('etatLotsAnalyseExportateur')
    async etatLotsAnalyseExportateur(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.controllerService.etatLotsAnalyseExportateur(findOption);
        return result;
    }
 
    @Get('inventaireLotsExportateur')
    async inventaireLotsExportateur(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.controllerService.inventaireLotsExportateur(findOption);
        return result;
    }
    
    
    
}
