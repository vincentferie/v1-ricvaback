import { Body, Controller, Get, Param, Post, Delete, UsePipes, Patch, ParseUUIDPipe, Query, ValidationPipe, UseInterceptors, UploadedFile, Res, UseGuards, Header } from '@nestjs/common';
import { ParseJsonPipe } from 'src/helpers/pipes/parse-json.pipe';
import { SoftDelete } from 'src/helpers/enums/softdelete.enum';
import { SoftDeleteValidationPipe } from 'src/helpers/pipes/softdelete-validation.pipe';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { docFileFilter, editFileName } from 'src/helpers/utils/regex-file.define';
import { ApiTags } from '@nestjs/swagger';
import { SubContratsService } from './sub-contrats.service';
import { SubContratsDto } from './sub-contrats.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtInfoGetter } from 'src/helpers/decorator/jwt-info-getter.decorator';
import { Roles } from 'src/helpers/decorator/role.decorator';
import { Role } from 'src/helpers/enums/role.enum';
import { fileRead } from 'src/helpers/utils/readFiles';

export const destination = './uploads/sub-contrats';

@ApiTags('sub-contrats')
@Controller('sub-contrats')
@UseGuards(AuthGuard('jwt'))
@Roles(Role.Manager, Role.Financial)
export class SubContratsController {
      
    constructor(private readonly controllerService: SubContratsService) { }

    @Post()
    @UsePipes(ValidationPipe)
    async save(
        @JwtInfoGetter() payload, 
        @Body() inputDto: SubContratsDto,
        ) {
        inputDto.created_by = `${payload.user.nom} ${payload.user.prenoms}`;
        inputDto.created = new Date(Date.now());
        inputDto.mode = SoftDelete.active;
        const result = await this.controllerService.save(payload, inputDto);
        return result;

   }

    @Patch('/edit/:primaryKey')
    async update(
        @JwtInfoGetter() payload, 
        @Body(ValidationPipe) inputDto: SubContratsDto,
        @Param('primaryKey', ParseUUIDPipe) primaryKey) {
            inputDto.updated_by = `${payload.user.nom} ${payload.user.prenoms}`;
            inputDto.updated = new Date(Date.now());
        const result = await this.controllerService.update(payload, inputDto, primaryKey);
        return result;
    }
  
    @Patch('/file/:primaryKey')
    async updateFile(
        @JwtInfoGetter() payload, 
        @Param('primaryKey', ParseUUIDPipe) primaryKey,
        @Body('file') file
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

    @Get('/download/:filename')
    // @Header('Content-type', 'application/octet-stream')
    // async dowloadFile(@Param('filename') filename,): Promise<Buffer> {
    //   // return res.sendFile(filename, { root: destination });
    //   return await fileRead(destination, filename);
    // }
    @Header('Content-type', 'application/pdf')
    async dowloadFile(@JwtInfoGetter() payload, @Param('filename') filename, @Res() res) {
        return res.sendFile(filename, { root: destination });
      }


    
}
