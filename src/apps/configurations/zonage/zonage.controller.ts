
import { Body, Controller, Get, Param, Post, Delete, UsePipes, Patch, ParseUUIDPipe, Query, ValidationPipe, UseGuards } from '@nestjs/common';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { ParseJsonPipe } from 'src/helpers/pipes/parse-json.pipe';
import { SoftDeleteValidationPipe } from 'src/helpers/pipes/softdelete-validation.pipe';
import { ApiTags } from '@nestjs/swagger';
import { ZonageDto } from './zonage.dto';
import { ZonageService } from './zonage.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtInfoGetter } from 'src/helpers/decorator/jwt-info-getter.decorator';
import { Roles } from 'src/helpers/decorator/role.decorator';
import { Role } from 'src/helpers/enums/role.enum';

@ApiTags('zonage')
@Controller('zonage')
@UseGuards(AuthGuard('jwt'))
@Roles(Role.Manager, Role.Administrator)
export class ZonageController {
    constructor(private readonly typesMembreService: ZonageService) { }

    @Post()
    @UsePipes(ValidationPipe)
    async save(
        @JwtInfoGetter() payload, 
        @Body() statutZonnageDto: ZonageDto
    ) {
        statutZonnageDto.created = new Date(Date.now());
        statutZonnageDto.created_by = `${payload.user.nom} ${payload.user.prenoms}`;
        statutZonnageDto.mode = SoftDelete.active;
        const result = await this.typesMembreService.save(payload, statutZonnageDto);
        return result;
    }

    @Patch('/edit/:primaryKey')
    async update(
        @JwtInfoGetter() payload, 
        @Body(ValidationPipe) statutZonnageDto: ZonageDto,
        @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        statutZonnageDto.updated = new Date(Date.now());
        statutZonnageDto.updated_by = `${payload.user.nom} ${payload.user.prenoms}`;
        const result = await this.typesMembreService.update(payload, statutZonnageDto, primaryKey);
        return result;
    }

    @Patch('/edit/:primaryKey/mode')
    async updateMode(
        @JwtInfoGetter() payload, 
        @Body('mode', SoftDeleteValidationPipe) mode: SoftDelete,
        @Param('primaryKey', ParseUUIDPipe) primaryKey) {

        const result = await this.typesMembreService.updateMode(payload, primaryKey, mode);
        return result;
    }

    @Delete(':primaryKey')
    async delete(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.typesMembreService.delete(payload, primaryKey);
        return result;
    }

    @Delete('/softdelete/:primaryKey')
    async softDelete(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.typesMembreService.softDelete(payload, primaryKey);
        return result;
    }

    @Get()
    @Roles(Role.Manager, Role.Operator, Role.Accounting, Role.Financial)
    async find(@JwtInfoGetter() payload, ) {
        const result = await this.typesMembreService.find(payload, {});
        return result;
    }

    @Get('try')
    @Roles(Role.Manager, Role.Operator, Role.Accounting, Role.Financial)
    async findMode(@JwtInfoGetter() payload, @Query('mode', SoftDeleteValidationPipe) mode: SoftDelete) {
        const result = await this.typesMembreService.findMode(payload, mode);
        return result;
    }

    @Get('query/:option')
    @Roles(Role.Manager, Role.Operator, Role.Accounting, Role.Financial)
    async findQuery(@JwtInfoGetter() payload, @Param('option', ParseJsonPipe) findOption) {
        const result = await this.typesMembreService.find(payload, findOption);
        return result;
    }

    @Get(':primaryKey')
    @Roles(Role.Manager, Role.Operator, Role.Accounting, Role.Financial)
    async findById(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.typesMembreService.findById(payload, primaryKey);
        return result;
    }
}