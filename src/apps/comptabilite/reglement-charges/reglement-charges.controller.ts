import { Body, Controller, Get, Param, Post, Delete, UsePipes, Patch, ParseUUIDPipe, Query, ValidationPipe, UseGuards } from '@nestjs/common';
import { ParseJsonPipe } from 'src/helpers/pipes/parse-json.pipe';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { SoftDeleteValidationPipe } from 'src/helpers/pipes/softdelete-validation.pipe';
import { ApiTags } from '@nestjs/swagger';
import { ReglementChargesService } from './reglement-charges.service';
import { ReglementChargesDto } from './reglement-charges.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtInfoGetter } from 'src/helpers/decorator/jwt-info-getter.decorator';
import { Roles } from 'src/helpers/decorator/role.decorator';
import { Role } from 'src/helpers/enums/role.enum';

@ApiTags('reglement-charges')
@Controller('reglement-charges')
@UseGuards(AuthGuard('jwt'))
@Roles(Role.Manager, Role.Accounting)
export class ReglementChargesController {

    constructor(private readonly controllerService: ReglementChargesService) { }

    @Post()
    @UsePipes(ValidationPipe)
    async save(@JwtInfoGetter() payload, @Body() inputDto: ReglementChargesDto) {
        inputDto.created = new Date(Date.now());
        inputDto.created_by = `${payload.user.nom} ${payload.user.prenoms}`;
        inputDto.mode = SoftDelete.active;
        const result = await this.controllerService.save(payload, inputDto);
        return result;
    }

    @Patch('/edit/:primaryKey')
    async update(
        @JwtInfoGetter() payload, 
        @Body(ValidationPipe) inputDto: ReglementChargesDto,
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
    async find(@JwtInfoGetter() payload, ) {
        const result = await this.controllerService.find(payload, {});
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
