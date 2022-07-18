import { Controller, Post, UsePipes, ValidationPipe, Body, Patch, ParseUUIDPipe, Param, Delete, Get, Query, UseGuards } from '@nestjs/common';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { SoftDeleteValidationPipe } from 'src/helpers/pipes/softdelete-validation.pipe';
import { ParseJsonPipe } from 'src/helpers/pipes/parse-json.pipe';
import { ApiTags } from '@nestjs/swagger';
import { CampagneSpecService } from './campagne-spec.service';
import { CampagneSpecDto } from './campagne-spec.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtInfoGetter } from 'src/helpers/decorator/jwt-info-getter.decorator';
import { Role } from 'src/helpers/enums/role.enum';
import { Roles } from 'src/helpers/decorator/role.decorator';

@ApiTags('campagne-spec')
@Controller('campagne-spec')
@UseGuards(AuthGuard('jwt'))
@Roles(Role.Manager, Role.Administrator)
export class CampagneSpecController {

    constructor(private readonly service: CampagneSpecService) { }

    // @Post()
    // @UsePipes(ValidationPipe)
    // async save(@Body() detailSpeculationDto: DetailsSpeculationDto) {
    //     detailSpeculationDto.created = new Date(Date.now());
    //     detailSpeculationDto.mode = SoftDelete.active;
    //     const result = await this.detailSpeculationService.save(detailSpeculationDto);
    //     return result;
    // }

    @Patch('/edit/:primaryKey')
    @UsePipes(ValidationPipe)
    async update(
        @JwtInfoGetter() payload, 
        @Body(ValidationPipe) inputDto: CampagneSpecDto,
        @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        inputDto.updated = new Date(Date.now());
        inputDto.updated_by = `${payload.user.nom} ${payload.user.prenoms}`;
        const result = await this.service.update(payload, inputDto, primaryKey);
        return result;
    }

    @Patch('/edit/:primaryKey/mode')
    @UsePipes(ValidationPipe)
    async updateMode(
        @JwtInfoGetter() payload, 
        @Body('mode', SoftDeleteValidationPipe) mode: SoftDelete,
        @Param('primaryKey', ParseUUIDPipe) primaryKey) {

        const result = await this.service.updateMode(payload, primaryKey, mode);
        return result;
    }

    @Delete(':primaryKey')
    @UsePipes(ValidationPipe)
    async delete(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.service.delete(payload, primaryKey);
        return result;
    }

    @Delete('/softdelete/:primaryKey')
    @UsePipes(ValidationPipe)
    async softDelete(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.service.softDelete(payload, primaryKey);
        return result;
    }

    @Get()
    async find(@JwtInfoGetter() payload, ) {
        const result = await this.service.find(payload, {});
        return result;
    }

    @Get('paginate')
    async findPaginate(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.service.findPaginate(payload, findOption);
        return result;
    }

    @Get('paginate/query')
    async findPaginateResearch(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.service.findPaginateResearch(payload, findOption);
        return result;
    }

    @Get('try')
    async findMode(@JwtInfoGetter() payload, @Query('mode', SoftDeleteValidationPipe) mode: SoftDelete) {
        const result = await this.service.findMode(payload, mode);
        return result;
    }

    @Get('query/:option')
    @UsePipes(ValidationPipe)
    async findQuery(@JwtInfoGetter() payload, @Param('option', ParseJsonPipe) findOption) {
        const result = await this.service.find(payload, findOption);
        return result;
    }

    @Get(':primaryKey')
    @UsePipes(ValidationPipe)
    async findById(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.service.findById(payload, primaryKey);
        return result;
    }

}
