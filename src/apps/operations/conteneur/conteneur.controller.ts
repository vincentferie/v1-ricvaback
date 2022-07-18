import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { JwtInfoGetter } from 'src/helpers/decorator/jwt-info-getter.decorator';
import { Roles } from 'src/helpers/decorator/role.decorator';
import { Role } from 'src/helpers/enums/role.enum';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { ParseJsonPipe } from 'src/helpers/pipes/parse-json.pipe';
import { SoftDeleteValidationPipe } from 'src/helpers/pipes/softdelete-validation.pipe';
import { ConteneursDto } from './conteneur.dto';
import { ConteneursService } from './conteneur.service';

@ApiTags('conteneurs')
@Controller('conteneurs')
@UseGuards(AuthGuard('jwt'))
@Roles(Role.Manager, Role.Operator)
export class ConteneursController {

    constructor(private readonly controllerService: ConteneursService) { }

    @Post()
    @UsePipes(ValidationPipe)
    async save(@JwtInfoGetter() payload, @Body() inputDto: ConteneursDto) {
        inputDto.superviseur_id = payload.user.id;
        inputDto.created = new Date(Date.now());
        inputDto.created_by = `${payload.user.nom} ${payload.user.prenoms}`;
        inputDto.mode = SoftDelete.active;
        const result = await this.controllerService.save(payload, inputDto);
        return result;
    }

    @Patch('/edit/:primaryKey')
    async update(
        @JwtInfoGetter() payload,
        @Body(ValidationPipe) inputDto: ConteneursDto,
        @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        inputDto.updated = new Date(Date.now());
        inputDto.updated_by = `${payload.user.nom} ${payload.user.prenoms}`;
        const result = await this.controllerService.update(payload, inputDto, primaryKey);
        return result;
    }

    @Patch('/edit/:primaryKey/mode')
    async updateMode(
        @JwtInfoGetter() payload,
        @Body('mode', SoftDeleteValidationPipe) mode: SoftDelete,
        @Param('primaryKey', ParseUUIDPipe) primaryKey) {

        const result = await this.controllerService.updateMode(payload, primaryKey, mode);
        return result;
    }

    @Delete(':primaryKey')
    async delete(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.controllerService.delete(payload, primaryKey);
        return result;
    }

    @Delete('/softdelete/:primaryKey')
    async softDelete(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.controllerService.softDelete(payload, primaryKey);
        return result;
    }

    @Get()
    async find(@JwtInfoGetter() payload) {
        const result = await this.controllerService.find(payload, {});
        return result;
    }

    @Get('paginate')
    async findPaginate(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.controllerService.findPaginate(payload, findOption);
        return result;
    }

    @Get('paginate/query')
    async findPaginateResearch(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.controllerService.findPaginateResearch(payload, findOption);
        return result;
    }

    @Get('list/empotage')
    async listNonEmpotage(@JwtInfoGetter() payload) {
        const result = await this.controllerService.listNonEmpotage(payload);
        return result;
    }

    @Get('list/plomb')
    async listNonPlomb(@JwtInfoGetter() payload) {
        const result = await this.controllerService.listNonPlomb(payload);
        return result;
    }

    @Get('list/ticket-relevage')
    async listNonTicketRelevage(@JwtInfoGetter() payload) {
        const result = await this.controllerService.listNonTicketRelevage(payload);
        return result;
    }

    @Get('list/bill-of-landing')
    @Roles(Role.Manager, Role.Administrator)
    async listNonBL(@JwtInfoGetter() payload) {
        const result = await this.controllerService.listNonBL(payload);
        return result;
    }


    @Get('try')
    async findMode(@JwtInfoGetter() payload, @Query('mode', SoftDeleteValidationPipe) mode: SoftDelete) {
        const result = await this.controllerService.findMode(payload, mode);
        return result;
    }

    @Get('query/:option')
    async findQuery(@JwtInfoGetter() payload, @Param('option', ParseJsonPipe) findOption) {
        const result = await this.controllerService.find(payload, findOption);
        return result;
    }

    @Get(':primaryKey')
    async findById(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.controllerService.findById(payload, primaryKey);
        return result;
    }


}

