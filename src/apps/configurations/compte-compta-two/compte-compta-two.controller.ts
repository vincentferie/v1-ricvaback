import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { JwtInfoGetter } from 'src/helpers/decorator/jwt-info-getter.decorator';
import { Roles } from 'src/helpers/decorator/role.decorator';
import { Role } from 'src/helpers/enums/role.enum';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { ParseJsonPipe } from 'src/helpers/pipes/parse-json.pipe';
import { SoftDeleteValidationPipe } from 'src/helpers/pipes/softdelete-validation.pipe';
import { CompteComptableTwoDto } from './compte-compta-two.dto';
import { CompteComptaTwoService } from './compte-compta-two.service';

@ApiTags('compte-compta-two')
@Controller('compte-compta-two')
@UseGuards(AuthGuard('jwt'))
@Roles(Role.Manager, Role.Administrator, Role.Accounting)
export class CompteComptaTwoController {

    constructor(private readonly compteComptaService: CompteComptaTwoService) { }

    @Post()
    @UsePipes(ValidationPipe)
    async save(@JwtInfoGetter() payload, @Body() compteDto: CompteComptableTwoDto) {
        compteDto.created = new Date(Date.now());
        compteDto.updated_by = `${payload.user.nom} ${payload.user.prenoms}`;
        compteDto.mode = SoftDelete.active;
        const result = await this.compteComptaService.save(payload, compteDto);
        return result;
    }

    @Patch('/edit/:primaryKey')
    async update(
        @JwtInfoGetter() payload, 
        @Body(ValidationPipe) compteDto: CompteComptableTwoDto,
        @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        compteDto.updated = new Date(Date.now());
        compteDto.updated_by = `${payload.user.nom} ${payload.user.prenoms}`;
        const result = await this.compteComptaService.update(payload, compteDto, primaryKey);
        return result;
    }

    @Patch('/edit/:primaryKey/mode')
    async updateMode(
        @JwtInfoGetter() payload, 
        @Body('mode', SoftDeleteValidationPipe) mode: SoftDelete,
        @Param('primaryKey', ParseUUIDPipe) primaryKey) {

        const result = await this.compteComptaService.updateMode(payload, primaryKey, mode);
        return result;
    }

    @Delete(':primaryKey')
    async delete(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.compteComptaService.delete(payload, primaryKey);
        return result;
    }

    @Delete('/softdelete/:primaryKey')
    async softDelete(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.compteComptaService.softDelete(payload, primaryKey);
        return result;
    }

    @Get()
    async find(@JwtInfoGetter() payload, ) {
        const result = await this.compteComptaService.find(payload, {});
        return result;
    }

    @Get('try')
    async findMode(@JwtInfoGetter() payload, @Query('mode', SoftDeleteValidationPipe) mode: SoftDelete) {
        const result = await this.compteComptaService.findMode(payload, mode);
        return result;
    }

    @Get('query/:option')
    async findQuery(@JwtInfoGetter() payload, @Param('option', ParseJsonPipe) findOption) {
        const result = await this.compteComptaService.find(payload, findOption);
        return result;
    }

    @Get(':primaryKey')
    async findById(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.compteComptaService.findById(payload, primaryKey);
        return result;
    }


}
