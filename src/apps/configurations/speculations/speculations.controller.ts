import { Controller, ValidationPipe, ParseUUIDPipe, Post, UsePipes, Body, Patch, Param, Delete, Get, Query, UseGuards } from '@nestjs/common';
import { SpeculationsService } from './speculations.service';
import { SpeculationDto } from './speculation.dto';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { SoftDeleteValidationPipe } from 'src/helpers/pipes/softdelete-validation.pipe';
import { ParseJsonPipe } from 'src/helpers/pipes/parse-json.pipe';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { JwtInfoGetter } from 'src/helpers/decorator/jwt-info-getter.decorator';
import { Roles } from 'src/helpers/decorator/role.decorator';
import { Role } from 'src/helpers/enums/role.enum';

@ApiTags('speculations')
@Controller('speculations')
@UseGuards(AuthGuard('jwt'))
@Roles(Role.Manager, Role.Administrator)
export class SpeculationsController {

    constructor(private readonly speculationService: SpeculationsService) { }

    @Post()
    @UsePipes(ValidationPipe)
    async save(
        @JwtInfoGetter() payload, 
        @Body() speculationDto: SpeculationDto
    ) {
        speculationDto.created = new Date(Date.now());
        speculationDto.created_by = `${payload.user.nom} ${payload.user.prenoms}`;
        speculationDto.mode = SoftDelete.active;
        const result = await this.speculationService.save(payload, speculationDto);
        return result;
    }

    @Patch('/edit/:primaryKey')
    async update(
        @JwtInfoGetter() payload, 
        @Body(ValidationPipe) speculationDto: SpeculationDto,
        @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        speculationDto.updated = new Date(Date.now());
        speculationDto.updated_by = `${payload.user.nom} ${payload.user.prenoms}`;
        const result = await this.speculationService.update(payload, speculationDto, primaryKey);
        return result;
    }

    @Patch('/edit/:primaryKey/mode')
    async updateMode(
        @JwtInfoGetter() payload, 
        @Body('mode', SoftDeleteValidationPipe) mode: SoftDelete,
        @Param('primaryKey', ParseUUIDPipe) primaryKey) {

        const result = await this.speculationService.updateMode(payload, primaryKey, mode);
        return result;
    }

    @Delete(':primaryKey')
    async delete(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.speculationService.delete(payload, primaryKey);
        return result;
    }

    @Delete('/softdelete/:primaryKey')
    async softDelete(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.speculationService.softDelete(payload, primaryKey);
        return result;
    }

    @Get()
    @Roles(Role.Manager, Role.Operator, Role.Accounting, Role.Financial)
    async find(@JwtInfoGetter() payload, ) {
        const result = await this.speculationService.find(payload, {});
        return result;
    }

    @Get('try')
    @Roles(Role.Manager, Role.Operator, Role.Accounting, Role.Financial)
    async findMode(@JwtInfoGetter() payload, @Query('mode', SoftDeleteValidationPipe) mode: SoftDelete) {
        const result = await this.speculationService.findMode(payload, mode);
        return result;
    }

    @Get('query/:option')
    @Roles(Role.Manager, Role.Operator, Role.Accounting, Role.Financial)
    async findQuery(@JwtInfoGetter() payload, @Param('option', ParseJsonPipe) findOption) {
        const result = await this.speculationService.find(payload, findOption);
        return result;
    }

    @Get(':primaryKey')
    @Roles(Role.Manager, Role.Operator, Role.Accounting, Role.Financial)
    async findById(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.speculationService.findById(payload, primaryKey);
        return result;
    }

}
