import { Body, Controller, Get, Param, Post, Delete, UsePipes, Patch, ParseUUIDPipe, Query, ValidationPipe, UseGuards } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { ParseJsonPipe } from 'src/helpers/pipes/parse-json.pipe';
import { AccountDto } from './account.dto';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { SoftDeleteValidationPipe } from 'src/helpers/pipes/softdelete-validation.pipe';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { JwtInfoGetter } from 'src/helpers/decorator/jwt-info-getter.decorator';
import { Roles } from 'src/helpers/decorator/role.decorator';
import { Role } from 'src/helpers/enums/role.enum';

@ApiTags('account')
@Controller('account')
@UseGuards(AuthGuard('jwt'))
@Roles(Role.Manager, Role.Administrator)
export class AccountsController {

    constructor(private readonly accountsService: AccountsService) { }

    @Post()
    @UsePipes(ValidationPipe)
    async save(@JwtInfoGetter() payload, @Body() accountDto: AccountDto) {
        accountDto.created_by = `${payload.user.nom} ${payload.user.prenoms}`;
        accountDto.created = new Date(Date.now());
        accountDto.mode = SoftDelete.active;
        const result = await this.accountsService.save(payload, accountDto);
        return result;
    }

    @Patch('/edit/:primaryKey')
    async update(
        @JwtInfoGetter() payload, 
        @Body(ValidationPipe) accountDto: AccountDto,
        @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        accountDto.updated_by = `${payload.user.nom} ${payload.user.prenoms}`;
        accountDto.updated = new Date(Date.now());
        const result = await this.accountsService.update(payload, accountDto, primaryKey);
        return result;
    }

    @Patch('/edit/:primaryKey/mode')
    async updateMode(
        @JwtInfoGetter() payload, 
        @Body('mode', SoftDeleteValidationPipe) mode: SoftDelete,
        @Param('primaryKey', ParseUUIDPipe) primaryKey) {

        const result = await this.accountsService.updateMode(payload, primaryKey, mode);
        return result;
    }

    @Delete(':primaryKey')
    async delete(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.accountsService.delete(payload, primaryKey);
        return result;
    }

    @Delete('/softdelete/:primaryKey')
    async softDelete(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.accountsService.softDelete(payload, primaryKey);
        return result;
    }

    @Get()
    async find(@JwtInfoGetter() payload) {
        const result = await this.accountsService.find(payload, {});
        return result;
    }

    @Get('paginate')
    async findPaginate(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.accountsService.findPaginate(payload, findOption);
        return result;
    }

    @Get('paginate/query')
    async findPaginateResearch(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.accountsService.findPaginateResearch(payload, findOption);
        return result;
    }

    @Get('try')
    async findMode(@JwtInfoGetter() payload, @Query('mode', SoftDeleteValidationPipe) mode: SoftDelete) {
        const result = await this.accountsService.findMode(payload, mode);
        return result;
    }

    @Get('query/:option')
    async findQuery(@JwtInfoGetter() payload, @Param('option', ParseJsonPipe) findOption) {
        const result = await this.accountsService.find(payload, findOption);
        return result;
    }

    @Get(':primaryKey')
    async findById(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.accountsService.findById(payload, primaryKey);
        return result;
    }

}
