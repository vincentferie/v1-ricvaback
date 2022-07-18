import { Body, Controller, Get, Param, Post, Delete, UsePipes, Patch, ParseUUIDPipe, Query, ValidationPipe, UseInterceptors, UploadedFile, Res, UseGuards, Header } from '@nestjs/common';
import { ParseJsonPipe } from 'src/helpers/pipes/parse-json.pipe';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { SoftDeleteValidationPipe } from 'src/helpers/pipes/softdelete-validation.pipe';
import { ApiTags } from '@nestjs/swagger';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { docFileFilter, editFileName } from 'src/helpers/utils/regex-file.define';
import { BonLivraisonService } from './bon-livraison.service';
import { BonLivraisonDto } from './bon-livraison.dto';
import { DetailBlDto } from './details-bl/detail-bl.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtInfoGetter } from 'src/helpers/decorator/jwt-info-getter.decorator';
import { Roles } from 'src/helpers/decorator/role.decorator';
import { Role } from 'src/helpers/enums/role.enum';
// import { fileRead } from 'src/helpers/utils/readFiles';

export const destination = './uploads/bill-of-lading';

@ApiTags('bon-livraison')
@Controller('bon-livraison')
@UseGuards(AuthGuard('jwt'))
@Roles(Role.Manager, Role.Administrator)
export class BonLivraisonController {

    constructor(private readonly controllerService: BonLivraisonService) { }

    @Post()
    @UsePipes(ValidationPipe)
    async save(
        @JwtInfoGetter() payload, 
        @Body() inputDto: BonLivraisonDto,
        ) {
        inputDto.created = new Date(Date.now());
        inputDto.created_by = `${payload.user.nom} ${payload.user.prenoms}`;
        inputDto.mode = SoftDelete.active;
        const result = await this.controllerService.save(payload, inputDto);
        return result;
   }

    @Patch('/edit/:primaryKey')
    async update(
        @JwtInfoGetter() payload, 
        @Body(ValidationPipe) inputDto: BonLivraisonDto,
        @Param('primaryKey', ParseUUIDPipe) primaryKey) {
            inputDto.updated = new Date(Date.now());
            inputDto.updated_by = `${payload.user.nom} ${payload.user.prenoms}`;
        const result = await this.controllerService.update(payload, inputDto, primaryKey);
        return result;
    }

    @Patch('/edit/details/:primaryKey')
    async updateDetails(
        @JwtInfoGetter() payload, 
        @Body(ValidationPipe) inputDto: DetailBlDto[],
        @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.controllerService.updateDetails(payload, inputDto, primaryKey);
        return result;
    }
  
    @Patch('/file/:primaryKey')
    async updateFile(
        @JwtInfoGetter() payload, 
        @Param('primaryKey', ParseUUIDPipe) primaryKey,
        @Body('file') file
        // @UploadedFile() file
        ){
            const result = await this.controllerService.updateFile(payload, file, primaryKey);
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
    @Roles(Role.Manager, Role.Financial)
    async find(@JwtInfoGetter() payload, ) {
        const result = await this.controllerService.find(payload, {});
        return result;
    }

    @Get('paginate')
    @Roles(Role.Manager, Role.Financial)
    async findPaginate(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.controllerService.findPaginate(payload, findOption);
        return result;
    }

    @Get('paginate/query')
    @Roles(Role.Manager, Role.Financial)
    async findPaginateResearch(@JwtInfoGetter() payload, @Query() findOption) {
        const result = await this.controllerService.findPaginateResearch(payload, findOption);
        return result;
    }

    @Get('try')
    @Roles(Role.Manager, Role.Financial)
    async findMode(@JwtInfoGetter() payload, @Query('mode', SoftDeleteValidationPipe) mode: SoftDelete) {
        const result = await this.controllerService.findMode(payload, mode);
        return result;
    }

    @Get('query/:option')
    @Roles(Role.Manager, Role.Financial)
    async findQuery(@JwtInfoGetter() payload, @Param('option', ParseJsonPipe) findOption) {
        const result = await this.controllerService.find(payload, findOption);
        return result;
    }

    @Get(':primaryKey')
    @Roles(Role.Manager, Role.Financial)
    async findById(@JwtInfoGetter() payload, @Param('primaryKey', ParseUUIDPipe) primaryKey) {
        const result = await this.controllerService.findById(payload, primaryKey);
        return result;
    }

    @Get('/download/:filename')
    // @Header('Content-type', 'application/octet-stream')
    @Roles(Role.Manager, Role.Financial)
    // async dowloadFile(@Param('filename') filename,): Promise<Buffer> {
    //   // return res.sendFile(filename, { root: destination });
    //   return await fileRead(destination, filename);
    // }
    @Header('Content-type', 'application/pdf')
    async dowloadFile(@JwtInfoGetter() payload, @Param('filename') filename, @Res() res) {
        return res.sendFile(filename, { root: destination });
      }



}
