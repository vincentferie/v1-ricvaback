import { Controller, ValidationPipe, Body, UsePipes, Post, ParseUUIDPipe, Param, Patch, Delete, Get, Query, UseGuards } from '@nestjs/common';
import { InfosExportateurService } from './infos-exportateur.service';
import { InfosExportateurDto } from './infos-exportateur.dto';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { SoftDeleteValidationPipe } from 'src/helpers/pipes/softdelete-validation.pipe';
import { ParseJsonPipe } from 'src/helpers/pipes/parse-json.pipe';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { JwtInfoGetter } from 'src/helpers/decorator/jwt-info-getter.decorator';
import { Roles } from 'src/helpers/decorator/role.decorator';
import { Role } from 'src/helpers/enums/role.enum';

@ApiTags('infos-exportateur')
@Controller('infos-exportateur')
@UseGuards(AuthGuard('jwt'))
@Roles(Role.Manager, Role.Administrator)
export class InfosExportateurController {

    constructor(private readonly infosExportateurService: InfosExportateurService) { }

    @Post()
    @UsePipes(ValidationPipe)
    async save(
        @JwtInfoGetter() payload, 
        @Body() infosExportateurDto: InfosExportateurDto
    ) {
        infosExportateurDto.created = new Date(Date.now());
        infosExportateurDto.created_by = `${payload.user.nom} ${payload.user.prenoms}`;
        infosExportateurDto.mode = SoftDelete.active;
        const result = await this.infosExportateurService.save(payload, infosExportateurDto);
        return result;
    }

    @Patch('/edit/:primaryKey')
    async update(
        @JwtInfoGetter() payload, 
        @Body(ValidationPipe) infosExportateurDto: InfosExportateurDto,
        @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        infosExportateurDto.updated = new Date(Date.now());
        infosExportateurDto.updated_by = `${payload.user.nom} ${payload.user.prenoms}`;
        const result = await this.infosExportateurService.update(payload, infosExportateurDto, primaryKey);
        return result;
    }

    @Patch('/edit/:primaryKey/mode')
    async updateMode(
        @JwtInfoGetter() payload, 
        @Body('mode', SoftDeleteValidationPipe) mode: SoftDelete,
        @Param('primaryKey', ParseUUIDPipe) primaryKey) {

        const result = await this.infosExportateurService.updateMode(payload, primaryKey, mode);
        return result;
    }

    @Delete(':primaryKey')
    async delete(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.infosExportateurService.delete(payload, primaryKey);
        return result;
    }

    @Delete('/softdelete/:primaryKey')
    async softDelete(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.infosExportateurService.softDelete(payload, primaryKey);
        return result;
    }

    @Get()
    @Roles(Role.Manager, Role.Operator, Role.Accounting, Role.Financial)
    async find(@JwtInfoGetter() payload, ) {
        const result = await this.infosExportateurService.find(payload, {});
        return result;
    }

    @Get('paginate')
    @Roles(Role.Manager, Role.Operator, Role.Accounting, Role.Financial)
    async findPaginate(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.infosExportateurService.findPaginate(payload, findOption);
        return result;
    }

    @Get('paginate/query')
    @Roles(Role.Manager, Role.Operator, Role.Accounting, Role.Financial)
    async findPaginateResearch(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.infosExportateurService.findPaginateResearch(payload, findOption);
        return result;
    }

    @Get('try')
    @Roles(Role.Manager, Role.Operator, Role.Accounting, Role.Financial)
    async findMode(@JwtInfoGetter() payload, @Query('mode', SoftDeleteValidationPipe) mode: SoftDelete) {
        const result = await this.infosExportateurService.findMode(payload, mode);
        return result;
    }

    @Get('query/:option')
    @Roles(Role.Manager, Role.Operator, Role.Accounting, Role.Financial)
    async findQuery(@JwtInfoGetter() payload, @Param('option', ParseJsonPipe) findOption) {
        const result = await this.infosExportateurService.find(payload, findOption);
        return result;
    }

    @Get(':primaryKey')
    @Roles(Role.Manager, Role.Operator, Role.Accounting, Role.Financial)
    async findById(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.infosExportateurService.findById(payload, primaryKey);
        return result;
    }


}
