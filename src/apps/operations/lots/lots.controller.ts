import { Body, Controller, Get, Param, Post, Delete, UsePipes, Patch, ParseUUIDPipe, Query, ValidationPipe, UseInterceptors, UploadedFile, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { docFileFilter, editFileName } from 'src/helpers/utils/regex-file.define';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { ParseJsonPipe } from 'src/helpers/pipes/parse-json.pipe';
import { SoftDeleteValidationPipe } from 'src/helpers/pipes/softdelete-validation.pipe';
import { LotsDto } from './lot.dto';
import { LotsService } from './lots.service';
import { QueryOptionDto } from 'src/helpers/dto/query-option.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtInfoGetter } from 'src/helpers/decorator/jwt-info-getter.decorator';
import { Roles } from 'src/helpers/decorator/role.decorator';
import { Role } from 'src/helpers/enums/role.enum';
import { LotsUpdateDto } from './lot-update.dto';

export const destination = './uploads/ticket-pesee';

@ApiTags('lots')
@Controller('lots')
@UseGuards(AuthGuard('jwt'))
export class LotsController {

    constructor(private readonly controllerService: LotsService) { }

    @Post()
    @UsePipes(ValidationPipe)
    @Roles(Role.Manager, Role.Operator)
    async save(
        @JwtInfoGetter() payload, 
        @Body() inputDto: LotsDto,
        ) {
        inputDto.superviseur_id = payload.user.id;
        inputDto.created = new Date(Date.now());
        inputDto.created_by = `${payload.user.nom} ${payload.user.prenoms}`;
        inputDto.mode = SoftDelete.active;
        const result = await this.controllerService.save(payload, inputDto);
        return result;
   }

    @Patch('/edit/:primaryKey')
    @Roles(Role.Manager, Role.Operator)
    async update(
        @JwtInfoGetter() payload, 
        @Body(ValidationPipe) inputDto: LotsUpdateDto,
        @Param('primaryKey', ParseUUIDPipe) primaryKey) {
            inputDto.updated = new Date(Date.now());
            inputDto.updated_by = `${payload.user.nom} ${payload.user.prenoms}`;
            const result = await this.controllerService.update(payload, inputDto, primaryKey);
        return result;
    }

    @Patch('/validate/:primaryKey')
    @Roles(Role.Manager, Role.Viewer)
    async validate(
        @JwtInfoGetter() payload, 
        @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.controllerService.validate(payload, primaryKey);
        return result;
    }

    @Patch('/nantissement/:primaryKey')
    @Roles(Role.Manager, Role.Operator)
    async nantissement(
        @JwtInfoGetter() payload, 
        @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.controllerService.nantissement(payload, primaryKey);
        return result;
    }
  
    @Patch('/file/:primaryKey')
    @Roles(Role.Manager, Role.Operator)
    async updateFile(
        @JwtInfoGetter() payload, 
        @Param('primaryKey', ParseUUIDPipe) primaryKey,
        @Body('file') file
        ){
            const result = await this.controllerService.updateFile(payload, file, primaryKey);
            return result;
    }

    @Patch('/edit/:primaryKey/mode')
    @Roles(Role.Manager, Role.Operator)
    async updateMode(
        @JwtInfoGetter() payload, 
        @Body('mode', SoftDeleteValidationPipe) mode: SoftDelete,
        @Param('primaryKey', ParseUUIDPipe) primaryKey) {

        const result = await this.controllerService.updateMode(payload, primaryKey, mode);
        return result;
    }

    @Delete(':primaryKey')
    @Roles(Role.Manager, Role.Operator)
    async delete(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.controllerService.delete(payload, primaryKey);
        return result;
    }

    @Delete('/softdelete/:primaryKey')
    @Roles(Role.Manager, Role.Operator)
    async softDelete(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.controllerService.softDelete(payload, primaryKey);
        return result;
    }

    @Get()
    @Roles(Role.Manager, Role.Operator, Role.Viewer)
    async find(@JwtInfoGetter() payload) {
        const result = await this.controllerService.find(payload, {});
        return result;
    }

    @Get('paginate')
    @Roles(Role.Manager, Role.Operator, Role.Viewer)
    async findPaginate(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.controllerService.findPaginate(payload, findOption);
        return result;
    }

    @Get('paginate/query')
    @Roles(Role.Manager, Role.Operator, Role.Viewer)
    async findPaginateResearch(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.controllerService.findPaginateResearch(payload, findOption);
        return result;
    }

    @Get('list/nantissement')
    @Roles(Role.Manager, Role.Operator, Role.Financial)
    async listNonNantissement(@JwtInfoGetter() payload) {
        const result = await this.controllerService.listNantissement(payload);
        return result;
    }

    @Get('list/empotage/:primaryKey')
    @Roles(Role.Manager, Role.Operator)
    async listNonEmpotage(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.controllerService.listNonEmpotage(payload, primaryKey);
        return result;
    }

    @Get('list/analyse')
    @Roles(Role.Manager, Role.Operator)
    async listNonAnalyse(@JwtInfoGetter() payload) {
        const result = await this.controllerService.listNonAnalyse(payload);
        return result;
    }

    @Get('list/transfert')
    @Roles(Role.Manager, Role.Operator)
    async listNonTransfert(@JwtInfoGetter() payload) {
        const result = await this.controllerService.listNonTransfert(payload);
        return result;
    }

    @Get('list/session')
    @Roles(Role.Manager, Role.Operator)
    async listNonSession(@JwtInfoGetter() payload) {
        const result = await this.controllerService.listNonSession(payload);
        return result;
    }

    @Get('try')
    @Roles(Role.Manager, Role.Operator, Role.Financial)
    async findMode(@JwtInfoGetter() payload, @Query('mode', SoftDeleteValidationPipe) mode: SoftDelete) {
        const result = await this.controllerService.findMode(payload, mode);
        return result;
    }

    @Get('query/:option')
    @Roles(Role.Manager, Role.Operator, Role.Financial)
    async findQuery(@JwtInfoGetter() payload, @Param('option', ParseJsonPipe) findOption) {
        const result = await this.controllerService.find(payload, findOption);
        return result;
    }

    @Get(':primaryKey')
    @Roles(Role.Manager, Role.Operator, Role.Financial)
    async findById(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.controllerService.findById(payload, primaryKey);
        return result;
    }

    @Get('/download/:filename')
    @Roles(Role.Manager, Role.Viewer, Role.Operator, Role.Financial)
    dowloadFile(@JwtInfoGetter() payload, @Param('filename') filename, @Res() res) {
      return res.sendFile(filename, { root: destination });
    }

    @Post('query')
    @UsePipes(ValidationPipe)
    @Roles(Role.Manager, Role.Operator, Role.Financial)
    async findOption(@JwtInfoGetter() payload, @Body() optionDto: QueryOptionDto) {
        const result = await this.controllerService.findOption(payload, optionDto);
        return result;
    }
    
}

