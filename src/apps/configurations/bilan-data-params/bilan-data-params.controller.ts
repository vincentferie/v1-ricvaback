import { Body, Controller, Get, Param, Post, Delete, UsePipes, Patch, ParseUUIDPipe, Query, ValidationPipe, UseGuards } from '@nestjs/common';
import { ParseJsonPipe } from 'src/helpers/pipes/parse-json.pipe';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { SoftDeleteValidationPipe } from 'src/helpers/pipes/softdelete-validation.pipe';
import { BilanDataParamsService } from './bilan-data-params.service';
import { BilanDataParamsDto } from './bilan-data-params.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { JwtInfoGetter } from 'src/helpers/decorator/jwt-info-getter.decorator';
import { Roles } from 'src/helpers/decorator/role.decorator';
import { Role } from 'src/helpers/enums/role.enum';
@ApiTags('bilan-data-params')
@Controller('bilan-data-params')
@UseGuards(AuthGuard('jwt'))
@Roles(Role.Manager, Role.Administrator ,Role.Accounting)
export class BilanDataParamsController {

    constructor(private readonly bilanService: BilanDataParamsService) { }

    @Post()
    @UsePipes(ValidationPipe)
    async save(@JwtInfoGetter() payload, @Body() bilanDto: BilanDataParamsDto) {
        bilanDto.created = new Date(Date.now());
        bilanDto.created_by = `${payload.user.nom} ${payload.user.prenoms}`;
        bilanDto.mode = SoftDelete.active;
        const result = await this.bilanService.save(payload, bilanDto);
        return result;
    }

    @Patch('/edit/:primaryKey')
    async update(
        @JwtInfoGetter() payload,
        @Body(ValidationPipe) bilanDto: BilanDataParamsDto,
        @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        bilanDto.updated = new Date(Date.now());
        bilanDto.updated_by = `${payload.user.nom} ${payload.user.prenoms}`;
        const result = await this.bilanService.update(payload, bilanDto, primaryKey);
        return result;
    }

    @Patch('/edit/:primaryKey/mode')
    async updateMode(
        @JwtInfoGetter() payload,
        @Body('mode', SoftDeleteValidationPipe) mode: SoftDelete,
        @Param('primaryKey', ParseUUIDPipe) primaryKey) {

        const result = await this.bilanService.updateMode(payload, primaryKey, mode);
        return result;
    }

    @Delete(':primaryKey')
    async delete(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.bilanService.delete(payload, primaryKey);
        return result;
    }

    @Delete('/softdelete/:primaryKey')
    async softDelete(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.bilanService.softDelete(payload, primaryKey);
        return result;
    }

    @Get()
    async find(@JwtInfoGetter() payload,) {
        const result = await this.bilanService.find(payload, {});
        return result;
    }

    @Get('try')
    async findMode(@JwtInfoGetter() payload, @Query('mode', SoftDeleteValidationPipe) mode: SoftDelete) {
        const result = await this.bilanService.findMode(payload, mode);
        return result;
    }

    @Get('query/:option')
    async findQuery(@JwtInfoGetter() payload, @Param('option', ParseJsonPipe) findOption) {
        const result = await this.bilanService.find(payload, findOption);
        return result;
    }

    @Get(':primaryKey')
    async findById(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.bilanService.findById(payload, primaryKey);
        return result;
    }

}
