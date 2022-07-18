import { Controller, ValidationPipe, Body, Patch, ParseUUIDPipe, Param, Delete, Get, Query, UseGuards } from '@nestjs/common';
import { DetailsSpeculationService } from './details-speculation.service';
import { DetailsSpeculationDto } from './detail-speculation.dto';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { SoftDeleteValidationPipe } from 'src/helpers/pipes/softdelete-validation.pipe';
import { ParseJsonPipe } from 'src/helpers/pipes/parse-json.pipe';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { JwtInfoGetter } from 'src/helpers/decorator/jwt-info-getter.decorator';
import { Roles } from 'src/helpers/decorator/role.decorator';
import { Role } from 'src/helpers/enums/role.enum';

@ApiTags('details-speculation')
@Controller('details-speculation')
@UseGuards(AuthGuard('jwt'))
@Roles(Role.Manager, Role.Administrator)
export class DetailsSpeculationController {

    constructor(private readonly detailSpeculationService: DetailsSpeculationService) { }

    // @Post()
    // @UsePipes(ValidationPipe)
    // async save(@Body() detailSpeculationDto: DetailsSpeculationDto) {
    //     detailSpeculationDto.created = new Date(Date.now());
    //     detailSpeculationDto.mode = SoftDelete.active;
    //     const result = await this.detailSpeculationService.save(detailSpeculationDto);
    //     return result;
    // }

    @Patch('/edit/:primaryKey')
    async update(
        @JwtInfoGetter() payload, 
        @Body(ValidationPipe) detailSpeculationDto: DetailsSpeculationDto,
        @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        detailSpeculationDto.updated = new Date(Date.now());
        detailSpeculationDto.updated_by = `${payload.user.nom} ${payload.user.prenoms}`;
        const result = await this.detailSpeculationService.update(payload, detailSpeculationDto, primaryKey);
        return result;
    }

    @Patch('/edit/:primaryKey/mode')
    async updateMode(
        @JwtInfoGetter() payload, 
        @Body('mode', SoftDeleteValidationPipe) mode: SoftDelete,
        @Param('primaryKey', ParseUUIDPipe) primaryKey) {

        const result = await this.detailSpeculationService.updateMode(payload, primaryKey, mode);
        return result;
    }

    @Delete(':primaryKey')
    async delete(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.detailSpeculationService.delete(payload, primaryKey);
        return result;
    }

    @Delete('/softdelete/:primaryKey')
    async softDelete(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.detailSpeculationService.softDelete(payload, primaryKey);
        return result;
    }

    @Get()
    @Roles(Role.Manager, Role.Operator, Role.Accounting, Role.Financial)
    async find(@JwtInfoGetter() payload, ) {
        const result = await this.detailSpeculationService.find(payload, {});
        return result;
    }

    @Get('paginate')
    @Roles(Role.Manager, Role.Operator, Role.Accounting, Role.Financial)
    async findPaginate(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.detailSpeculationService.findPaginate(payload, findOption);
        return result;
    }

    @Get('paginate/query')
    @Roles(Role.Manager, Role.Operator, Role.Accounting, Role.Financial)
    async findPaginateResearch(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.detailSpeculationService.findPaginateResearch(payload, findOption);
        return result;
    }
    
    @Get('try')
    @Roles(Role.Manager, Role.Operator, Role.Accounting, Role.Financial)
    async findMode(@JwtInfoGetter() payload, @Query('mode', SoftDeleteValidationPipe) mode: SoftDelete) {
        const result = await this.detailSpeculationService.findMode(payload, mode);
        return result;
    }

    @Get('query/:option')
    @Roles(Role.Manager, Role.Operator, Role.Accounting, Role.Financial)
    async findQuery(@JwtInfoGetter() payload, @Param('option', ParseJsonPipe) findOption) {
        const result = await this.detailSpeculationService.find(payload, findOption);
        return result;
    }

    @Get(':primaryKey')
    @Roles(Role.Manager, Role.Operator, Role.Accounting, Role.Financial)
    async findById(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.detailSpeculationService.findById(payload, primaryKey);
        return result;
    }

}
