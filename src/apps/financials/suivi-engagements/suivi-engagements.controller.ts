import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { JwtInfoGetter } from 'src/helpers/decorator/jwt-info-getter.decorator';
import { Roles } from 'src/helpers/decorator/role.decorator';
import { Role } from 'src/helpers/enums/role.enum';
import { SuiviEngagementsService } from './suivi-engagements.service';

@ApiTags('suivi-engagements')
@Controller('suivi-engagements')
@UseGuards(AuthGuard('jwt'))
@Roles(Role.Manager, Role.Financial, Role.Manager)
export class SuiviEngagementsController {
    constructor(private readonly controllerService: SuiviEngagementsService) { }

    @Get('/situationFinancement')
    async situationFinancement(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.controllerService.situationFinancement(findOption);
        return result;
    }

    @Get('/repartitionSolde')
    async repartitionSolde(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.controllerService.repartitionSolde(findOption);
        return result;
    }

    @Get('/repartitionPoidsSiteBank')
    async repartitionPoidsSiteBank(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.controllerService.repartitionPoidsSiteBank(findOption);
        return result;
    }

    @Get('/financementExecution')
    async financementExecution(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.controllerService.financementExecution(findOption);
        return result;
    }

    @Get('/dureeMoyenneFnancementDecouvertBanque')
    async dureeMoyenneFnancementDecouvertBanque(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.controllerService.dureeMoyenneFnancementDecouvertBanque(findOption);
        return result;
    }

    @Get('/dureeMoyenneFnancementNantissementBanque')
    async dureeMoyenneFnancementNantissementBanque(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.controllerService.dureeMoyenneFnancementNantissementBanque(findOption);
        return result;
    }

    @Get('/repartitionDecouvertBank')
    async repartitionDecouvertBank(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.controllerService.repartitionDecouvertBank(findOption);
        return result;
    }

    @Get('/repartitionTonnagesNantisBanque')
    async repartitionTonnagesNantisBanque(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.controllerService.repartitionTonnagesNantisBanque(findOption);
        return result;
    }
    
    @Get('/tauxUtilisationDecouvert')
    async tauxUtilisationDecouvert(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.controllerService.tauxUtilisationDecouvert(findOption);
        return result;
    }
    
    @Get('/tauxUtilisationNantissement')
    async tauxUtilisationNantissement(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.controllerService.tauxUtilisationNantissement(findOption);
        return result;
    }
    
    

}
