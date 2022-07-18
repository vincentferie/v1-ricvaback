import { Body, Controller, Get, Param, Post, Delete, UsePipes, Patch, ParseUUIDPipe, Query, ValidationPipe, UseGuards } from '@nestjs/common';
import { ParseJsonPipe } from 'src/helpers/pipes/parse-json.pipe';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { SoftDeleteValidationPipe } from 'src/helpers/pipes/softdelete-validation.pipe';
import { ApiTags } from '@nestjs/swagger';
import { RubriqueChargesService } from './rubrique-charges.service';
import { RubriquesChargesDto } from './rubrique-charges.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtInfoGetter } from 'src/helpers/decorator/jwt-info-getter.decorator';
import { Roles } from 'src/helpers/decorator/role.decorator';
import { Role } from 'src/helpers/enums/role.enum';
@ApiTags('rubrique-charges')
@Controller('rubrique-charges')
@UseGuards(AuthGuard('jwt'))
@Roles(Role.Manager, Role.Administrator)
export class RubriqueChargesController {

    constructor(private readonly controllerService: RubriqueChargesService) { }

    @Post()
    @UsePipes(ValidationPipe)
    async save(@JwtInfoGetter() payload, @Body() inputDto: RubriquesChargesDto) {
        inputDto.created = new Date(Date.now());
        inputDto.created_by = `${payload.user.nom} ${payload.user.prenoms}`;
        inputDto.mode = SoftDelete.active;
        const result = await this.controllerService.save(payload, inputDto);
        return result;
    }

    @Patch('/edit/:primaryKey')
    async update(
        @JwtInfoGetter() payload, 
        @Body(ValidationPipe) inputDto: RubriquesChargesDto,
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
    @Roles(Role.Manager, Role.Accounting)
    async find(@JwtInfoGetter() payload, ) {
        const result = await this.controllerService.find(payload, {});
        return result;
    }

    @Get('try')
    @Roles(Role.Manager, Role.Accounting)
    async findMode(@JwtInfoGetter() payload, @Query('mode', SoftDeleteValidationPipe) mode: SoftDelete) {
        const result = await this.controllerService.findMode(payload, mode);
        return result;
    }

    @Get('query/:option')
    @Roles(Role.Manager, Role.Accounting)
    async findQuery(@JwtInfoGetter() payload, @Param('option', ParseJsonPipe) findOption) {
        const result = await this.controllerService.find(payload, findOption);
        return result;
    }

    @Get(':primaryKey')
    @Roles(Role.Manager, Role.Accounting)
    async findById(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.controllerService.findById(payload, primaryKey);
        return result;
    }

}
