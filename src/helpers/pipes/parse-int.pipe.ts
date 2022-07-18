import { BadRequestException, HttpException } from '@nestjs/common';
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { responseRequest } from '../core/response-request';

@Injectable()
export class ParseIntPipe implements PipeTransform<string> {
  async transform(value, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
  }
    const json = plainToClass(metatype, value);
    const errors = await validate(json);

    if (isNaN(value)) {
      const exception = await responseRequest({
        status: 'errorRequest', 
        params: `${JSON.stringify(value)} n'est pas un entier`,
        data: errors ?? errors[0].constraints 
      });
    throw new HttpException(exception[0], exception[1]);
    }
    return parseInt(value, 10);
  }

    
  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find(type => metatype === type);
  }
}