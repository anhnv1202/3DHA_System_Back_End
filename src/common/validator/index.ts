import { IsNumberOptions, ValidationOptions } from 'class-validator';
import { IsNotEmpty as _IsNotEmpty } from 'class-validator';
import { IsString as _IsString } from 'class-validator';
import { IsBoolean as _IsBoolean } from 'class-validator';
import { IsNumber as _IsNumber } from 'class-validator';
import { IsArray as _IsArray } from 'class-validator';
import { IsOptional as _IsOptional } from 'class-validator';
import { IsIn as _IsIn } from 'class-validator';
import { Unique as _Unique } from 'typeorm';
import { VALIDATE_MESSAGE } from './message-validate';

/**
 * TypeORM
 */

export const Unique = (key: string) => _Unique(i18n.__mf(key), []);

/**
 * Class Validator
 * @value ($value) - the value that is being validated
 * @property ($property) - name of the object's property being validated
 * @target ($target) - name of the object's class being validated
 * @package constraint1, $constraint2, ... $constraintN - constraints defined by specific validation type
 */

export const IsNotEmpty = (validationOptions?: ValidationOptions) =>
  _IsNotEmpty({ ...validationOptions, message: VALIDATE_MESSAGE.FIELD_REQUIRE });

export const IsOptional = (validationOptions?: ValidationOptions) =>
  _IsOptional({ ...validationOptions, message: VALIDATE_MESSAGE.INPUT_NOT_VALID });

export const IsIn = (values: readonly any[], validationOptions?: ValidationOptions) =>
  _IsIn(values, { ...validationOptions, message: VALIDATE_MESSAGE.FIELD_REQUIRE });

export const IsBoolean = (validationOptions?: ValidationOptions) =>
  _IsBoolean({ ...validationOptions, message: VALIDATE_MESSAGE.INPUT_NOT_VALID });

export const IsArray = (validationOptions?: ValidationOptions) =>
  _IsArray({ ...validationOptions, message: VALIDATE_MESSAGE.INPUT_NOT_VALID });

export const IsString = (validationOptions?: ValidationOptions) =>
  _IsString({ ...validationOptions, message: VALIDATE_MESSAGE.INPUT_NOT_VALID });

export const IsNumber = (options?: IsNumberOptions, validationOptions?: ValidationOptions) =>
  _IsNumber(options, { ...validationOptions, message: VALIDATE_MESSAGE.INPUT_NOT_VALID });
