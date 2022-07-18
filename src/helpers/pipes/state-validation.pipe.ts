import { PipeTransform, HttpException, ArgumentMetadata } from "@nestjs/common";
import { responseRequest } from "../core/response-request";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { State } from "../enums/state.enum";


export class StateValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    State.pending,
    State.rejected,
    State.validated,
  ];

  async transform(value, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    const orig_value = value;
    value = parseInt(value);

    const enumm = plainToClass(metatype, value);
    const errors = await validate(enumm);

    if (!this.isStatusValid(value)) {
      const exception = await responseRequest({
        status: 'errorRequest',
        params: `${JSON.stringify(value) ?? orig_value} est un statut invalide`,
        data: errors ?? errors[0].constraints
      });
      throw new HttpException(exception[0], exception[1]);
    }

    return value;
  }

  private isStatusValid(status: any) {
    const idx = this.allowedStatuses.indexOf(status);
    return idx !== -1;
  }
}     