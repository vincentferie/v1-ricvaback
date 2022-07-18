import { Body, Controller, Get, Param, Post, Delete, UsePipes, Patch, ParseUUIDPipe, Query, ValidationPipe, UseInterceptors, UploadedFile, Res, UseGuards, Header } from '@nestjs/common';
import { ParseJsonPipe } from 'src/helpers/pipes/parse-json.pipe';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { SoftDeleteValidationPipe } from 'src/helpers/pipes/softdelete-validation.pipe';
import { ApiTags } from '@nestjs/swagger';
import { NantissementService } from './nantissement.service';
import { NantissementDto } from './nantissement.dto';
import { StateLots } from 'src/helpers/enums/state.enum';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { docFileFilter, editFileName } from 'src/helpers/utils/regex-file.define';
import { LotsNantisDto } from './lots-nantis/lots-nantis.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtInfoGetter } from 'src/helpers/decorator/jwt-info-getter.decorator';
import { Roles } from 'src/helpers/decorator/role.decorator';
import { Role } from 'src/helpers/enums/role.enum';
import { fileRead } from 'src/helpers/utils/readFiles';

export const destinationLettre = './uploads/lettre-tiers-detention';
export const destinationAutorisation = './uploads/autorisation-sortie';

@ApiTags('nantissement')
@Controller('nantissement')
@UseGuards(AuthGuard('jwt'))
@Roles(Role.Manager, Role.Financial)
export class NantissementController {

    constructor(private readonly controllerService: NantissementService) { }

    @Post()
    @UsePipes(ValidationPipe)
    async save(
        @JwtInfoGetter() payload, 
        @Body() inputDto: NantissementDto,
        ) {
        inputDto.statut = StateLots.nantis;
        inputDto.created_by = `${payload.user.nom} ${payload.user.prenoms}`;
        inputDto.created = new Date(Date.now());
        inputDto.mode = SoftDelete.active;
        const result = await this.controllerService.save(payload, inputDto);
        return result;

   }

   @Post('/autorisation/:primaryKey')
   @UsePipes(ValidationPipe)
   async relache(
        @JwtInfoGetter() payload, 
        @Param('primaryKey', ParseUUIDPipe) primaryKey,
        @Body('file') file
       ) {
            const result = await this.controllerService.relache(payload, file, primaryKey);
            return result;
  }

    @Patch('/edit/:primaryKey')
    async update(
        @JwtInfoGetter() payload, 
        @Body(ValidationPipe) inputDto: NantissementDto,
        @Param('primaryKey', ParseUUIDPipe) primaryKey) {
            inputDto.updated_by = `${payload.user.nom} ${payload.user.prenoms}`;
            inputDto.updated = new Date(Date.now());
        const result = await this.controllerService.update(payload, inputDto, primaryKey);
        return result;
    }

    @Patch('/edit/lots/:primaryKey')
    async updateLots(
        @JwtInfoGetter() payload, 
        @Body(ValidationPipe) inputDto: LotsNantisDto,
        @Param('primaryKey', ParseUUIDPipe) primaryKey) {
            inputDto.updated_by = `${payload.user.nom} ${payload.user.prenoms}`;
            inputDto.updated = new Date(Date.now());
        const result = await this.controllerService.updateLots(payload, inputDto, primaryKey);
        return result;
    }
  
    @Patch('/lettre/:primaryKey')
    async updateLettre(
        @JwtInfoGetter() payload, 
        @Param('primaryKey', ParseUUIDPipe) primaryKey,
        @Body('lettre') file
        ){
            const result = await this.controllerService.updateLettre(payload, file, primaryKey);
            return result;
    }

    @Patch('/autorisation/:primaryKey')
    async updateAutorisation(
        @JwtInfoGetter() payload, 
        @Param('primaryKey', ParseUUIDPipe) primaryKey,
        @Body('file') file
        ){
            const result = await this.controllerService.updateAutorisation(payload, file, primaryKey);
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

    @Delete('/softdelete/lots/:primaryKey')
    async deleteLots(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.controllerService.deleteLots(payload, primaryKey);
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

    @Get('paginate')
    async findPaginate(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.controllerService.findPaginate(payload, findOption);
        return result;
    }

    @Get('list/denantissement')
    async listDenantissement(@JwtInfoGetter() payload) {
        const result = await this.controllerService.listDenantissement(payload);
        return result;
    }

    @Get('paginate/query')
    async findPaginateResearch(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.controllerService.findPaginateResearch(payload, findOption);
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

    @Get('/lettre/download/:filename')
    // @Header('Content-type', 'application/octet-stream')
    // async dowloadFileLettre(@Param('filename') filename,): Promise<Buffer> {
    //   // return res.sendFile(filename, { root: destination });
    //   return await fileRead(destinationLettre, filename);
    // }
    @Header('Content-type', 'application/pdf')
    async dowloadFileLettre(@JwtInfoGetter() payload, @Param('filename') filename, @Res() res) {
        return res.sendFile(filename, { root: destinationLettre });
      }



    @Get('/autorisation/download/:filename')
    // @Header('Content-type', 'application/octet-stream')
    // async dowloadFileAutorisation(@Param('filename') filename,): Promise<Buffer> {
    //   // return res.sendFile(filename, { root: destination });
    //   return await fileRead(destinationAutorisation, filename);
    // }
    @Header('Content-type', 'application/pdf')
    async dowloadFileAutorisation(@JwtInfoGetter() payload, @Param('filename') filename, @Res() res) {
        return res.sendFile(filename, { root: destinationAutorisation });
      }

}
