import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { JwtInfoGetter } from 'src/helpers/decorator/jwt-info-getter.decorator';
import { Roles } from 'src/helpers/decorator/role.decorator';
import { Role } from 'src/helpers/enums/role.enum';
import { inputVgmModel } from './input-vgm.model';
import { TrackingBlService } from './tracking.service';

@ApiTags('tracking-bl')
@Controller('tracking-bl')
@UseGuards(AuthGuard('jwt'))
@Roles(Role.Manager, Role.Administrator)
export class TrackingBlController {
    constructor(
        private readonly controllerService: TrackingBlService
        ) { }

    @Post('vgmtrackingstart')
    async vgmtracking(@JwtInfoGetter() payload, @Body() inputDto: inputVgmModel) {
        const result = await this.controllerService.vgmtracking(payload, inputDto);
        return result;
    }

    @Get('vgmtrackingretrieve/:primaryKey')
    async getvgmtracking(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.controllerService.find(payload, primaryKey);
        return result;
    }

    @Get('vgmtrackingretrieve/paginate/:primaryKey')
    async getvgmtrackingpaginate(@JwtInfoGetter() payload,  @Query() findOption, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.controllerService.findPaginate(payload, primaryKey, findOption);
        return result;
    }

    @Get('vgmtrackingjob/:primaryKey')
    async vgmJobRestart(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.controllerService.vgmJobRestart(payload, primaryKey);
        return result;
    }

    

}