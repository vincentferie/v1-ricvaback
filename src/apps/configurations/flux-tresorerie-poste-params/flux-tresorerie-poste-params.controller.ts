import { Body, Controller, Get, Param, Post, Delete, UsePipes, Patch, ParseUUIDPipe, Query, ValidationPipe, UseGuards } from '@nestjs/common';
import { ParseJsonPipe } from 'src/helpers/pipes/parse-json.pipe';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { SoftDeleteValidationPipe } from 'src/helpers/pipes/softdelete-validation.pipe';
import { FluxTresoreriePosteParamsService } from './flux-tresorerie-poste-params.service';
import { FluxTresoreriePosteParamsDto } from './flux-tresorerie-poste-params.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { JwtInfoGetter } from 'src/helpers/decorator/jwt-info-getter.decorator';
import { Roles } from 'src/helpers/decorator/role.decorator';
import { Role } from 'src/helpers/enums/role.enum';

@ApiTags('flux-tresorerie-poste-params')
@Controller('flux-tresorerie-poste-params')
@UseGuards(AuthGuard('jwt'))
@Roles(Role.Manager, Role.Administrator, Role.Accounting)
export class FluxTresoreriePosteParamsController {

    constructor(private readonly fluxService: FluxTresoreriePosteParamsService) { }

    @Post()
    @UsePipes(ValidationPipe)
    async save(@JwtInfoGetter() payload, @Body() fluxDto: FluxTresoreriePosteParamsDto) {
        fluxDto.created = new Date(Date.now());
        fluxDto.created_by = `${payload.user.nom} ${payload.user.prenoms}`;
        fluxDto.mode = SoftDelete.active;
        const result = await this.fluxService.save(payload, fluxDto);
        return result;
    }

    @Patch('/edit/:primaryKey')
    async update(
        @JwtInfoGetter() payload, 
        @Body(ValidationPipe) fluxDto: FluxTresoreriePosteParamsDto,
        @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        fluxDto.updated = new Date(Date.now());
        fluxDto.updated_by = `${payload.user.nom} ${payload.user.prenoms}`;
        const result = await this.fluxService.update(payload, fluxDto, primaryKey);
        return result;
    }

    @Patch('/edit/:primaryKey/mode')
    async updateMode(
        @JwtInfoGetter() payload, 
        @Body('mode', SoftDeleteValidationPipe) mode: SoftDelete,
        @Param('primaryKey', ParseUUIDPipe) primaryKey) {

        const result = await this.fluxService.updateMode(payload, primaryKey, mode);
        return result;
    }

    @Delete(':primaryKey')
    async delete(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.fluxService.delete(payload, primaryKey);
        return result;
    }

    @Delete('/softdelete/:primaryKey')
    async softDelete(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.fluxService.softDelete(payload, primaryKey);
        return result;
    }

    @Get()
    async find(@JwtInfoGetter() payload, ) {
        const result = await this.fluxService.find(payload, {});
        return result;
    }

    @Get('try')
    async findMode(@JwtInfoGetter() payload, @Query('mode', SoftDeleteValidationPipe) mode: SoftDelete) {
        const result = await this.fluxService.findMode(payload, mode);
        return result;
    }

    @Get('query/:option')
    async findQuery(@JwtInfoGetter() payload, @Param('option', ParseJsonPipe) findOption) {
        const result = await this.fluxService.find(payload, findOption);
        return result;
    }

    @Get(':primaryKey')
    async findById(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.fluxService.findById(payload, primaryKey);
        return result;
    }

}
