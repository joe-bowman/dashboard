/* tslint:disable max-classes-per-file */

import { assertUnreachable } from "tools/utils";

/** ===========================================================================
 * Result Types
 * ----------------------------------------------------------------------------
 * These are Rust-inspired Result types which provide a container for a value
 * which can either be: ok, error, or empty.
 * ============================================================================
 */

export enum ResultEnumType {
  "OK" = "OK",
  "NONE" = "NONE",
  "ERROR" = "ERROR",
}

interface IBaseResult<T> {
  unwrap: () => T;
  isErr: () => boolean;
  isEmpty: () => boolean;
  hasValue: () => boolean;
  getType: () => ResultEnumType;
}

interface IOk<T> extends IBaseResult<T> {
  readonly value: T;
  readonly type: ResultEnumType.OK;
}

interface INone extends IBaseResult<null> {
  readonly type: ResultEnumType.NONE;
}

interface IErr extends IBaseResult<string> {
  message: string;
  err: Error | undefined;
  readonly type: ResultEnumType.ERROR;
}

export type Result<T> = IOk<T> | IErr | INone;

/** ===========================================================================
 * Result Classes
 * ============================================================================
 */

class BaseResultClass {
  type: ResultEnumType = ResultEnumType.OK;
  isErr = () => false;
  isEmpty = () => false;
  hasValue = () => false;
  getType = () => this.type;
}

class Ok<T> extends BaseResultClass implements IOk<T> {
  value: T;
  type: ResultEnumType.OK = ResultEnumType.OK;

  constructor(value: T) {
    super();
    this.value = value;
  }

  hasValue = () => true;
  unwrap = () => this.value;
}

class Err extends BaseResultClass implements IErr {
  message: string;
  err: Error | undefined;
  type: ResultEnumType.ERROR = ResultEnumType.ERROR;

  constructor(message: string, err?: Error) {
    super();
    this.message = message;
    this.err = err ? err : undefined;
  }

  isErr = () => true;
  getErr = () => this.err;
  unwrap = () => this.message;
}

class None extends BaseResultClass implements INone {
  type: ResultEnumType.NONE = ResultEnumType.NONE;

  isEmpty = () => true;
  unwrap = () => null;
}

/** ===========================================================================
 * Helpers
 * ============================================================================
 */

/**
 * A helper to unwrap a Result type and return the contained value if it
 * exists. Returns the OK value if it exists or null otherwise.
 */
export const unwrapOkValueIfExists = <T extends {}>(result: Result<T>) => {
  const type = result.getType();
  const msg = " value received in unwrapResultValue, result: ";
  switch (type) {
    case ResultEnumType.OK:
      return result.unwrap();
    case ResultEnumType.NONE:
      console.log(`None ${msg}`, result);
      return null;
    case ResultEnumType.ERROR:
      console.log(`Error ${msg}`, result);
      return null;
    default:
      return assertUnreachable(type);
  }
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export { Ok, Err, None };
