import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  PipeTransform,
  ValidationError,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export class BackendValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const object = plainToClass(metadata.metatype, value);
    const errors = await validate(object);

    if (!errors.length) {
      return value;
    }

    throw new HttpException(
      { errors: this.formatErrors(errors) },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }

  formatErrors(errors: ValidationError[]) {
    return errors.reduce((acc, error) => {
      return { ...acc, ...this.formatErrorRecursive(error) };
    }, {});
  }

  formatErrorRecursive = (error: ValidationError) => {
    let result: any = {};

    if (error.constraints) {
      result[error.property] = Object.values(error.constraints);
    }

    if (error.children && error.children.length > 0) {
      error.children.forEach((child: ValidationError) => {
        result = { ...result, ...this.formatErrorRecursive(child) };
      });
    }

    return result;
  };
}
