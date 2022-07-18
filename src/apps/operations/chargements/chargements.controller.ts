import { Body, Controller, Get, Param, Post, Delete, UsePipes, Patch, ParseUUIDPipe, Query, ValidationPipe, UseInterceptors, UploadedFile, Res, UseGuards, Header } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { ParseJsonPipe } from 'src/helpers/pipes/parse-json.pipe';
import { SoftDeleteValidationPipe } from 'src/helpers/pipes/softdelete-validation.pipe';
//import { FileInterceptor } from '@nestjs/platform-express';
//import { diskStorage } from 'multer';
//import { docFileFilter, editFileName } from 'src/helpers/utils/regex-file.define';
import { ChargementsDto } from './chargement.dto';
import { ChargementsService } from './chargements.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtInfoGetter } from 'src/helpers/decorator/jwt-info-getter.decorator';
import { Roles } from 'src/helpers/decorator/role.decorator';
import { Role } from 'src/helpers/enums/role.enum';
//import { fileRead } from 'src/helpers/utils/readFiles';

export const destination = './uploads/fiche-transfert';
@ApiTags('chargements')
@Controller('chargements')
@UseGuards(AuthGuard('jwt'))
export class ChargementsController {

    constructor(private readonly controllerService: ChargementsService) { }

    @Post()
    @UsePipes(ValidationPipe)
    @Roles(Role.Manager, Role.Operator)
    async save(  
        @JwtInfoGetter() payload, 
        @Body() inputDto: ChargementsDto,
        ) {
        inputDto.superviseur_id = payload.user.id;
        inputDto.tracteur = inputDto.tracteur.toUpperCase();
        inputDto.remorque = inputDto.remorque.toUpperCase();
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
        @Body(ValidationPipe) inputDto: ChargementsDto,
        @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        inputDto.tracteur = inputDto.tracteur.toUpperCase();
        inputDto.remorque = inputDto.remorque.toUpperCase();
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
    @Roles(Role.Manager, Role.Viewer, Role.Operator)
    async find(@JwtInfoGetter() payload, ) {
        const result = await this.controllerService.find(payload, {});
        return result;
    }

    @Get('paginate')
    @Roles(Role.Manager, Role.Viewer, Role.Operator)
    async findPaginate(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.controllerService.findPaginate(payload, findOption);
        return result;
    }

    @Get('paginate/query')
    @Roles(Role.Manager, Role.Viewer, Role.Operator)
    async findPaginateResearch(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.controllerService.findPaginateResearch(payload, findOption);
        return result;
    }

    @Get('list')
    @Roles(Role.Manager, Role.Operator)
    async list(@JwtInfoGetter() payload) {
        const result = await this.controllerService.list(payload);
        return result;
    }

    @Get('try')
    @Roles(Role.Manager, Role.Viewer, Role.Operator)
    async findMode(@JwtInfoGetter() payload, @Query('mode', SoftDeleteValidationPipe) mode: SoftDelete) {
        const result = await this.controllerService.findMode(payload, mode);
        return result;
    }

    @Get('query/:option')
    @Roles(Role.Manager, Role.Viewer, Role.Operator)
    async findQuery(@JwtInfoGetter() payload, @Param('option', ParseJsonPipe) findOption) {
        const result = await this.controllerService.find(payload, findOption);
        return result;
    }

    @Get(':primaryKey')
    @Roles(Role.Manager, Role.Viewer, Role.Operator)
    async findById(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.controllerService.findById(payload, primaryKey);
        return result;
    }

    @Get('/download/:filename')
    @Header('Content-type', 'application/pdf')
    //@Header('Content-type', 'application/octet-stream')
    @Roles(Role.Manager, Role.Viewer, Role.Operator)
    // async dowloadFile(@Param('filename') filename,): Promise<Buffer> {
    //   // return res.sendFile(filename, { root: destination });
    //   return await fileRead(destination, filename);
    // }
    async dowloadFile(@JwtInfoGetter() payload, @Param('filename') filename, @Res() res) {
      return res.sendFile(filename, { root: destination });
    }


}

