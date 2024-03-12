import { CustomError } from './CustomError';

export default class BadRequestError extends CustomError {
  private static readonly _statusCode = 400;
  private readonly _code: number;
  private readonly _logging: boolean;
  private readonly _context: { [key: string]: any };
  private readonly _errors: any[];

  constructor(params?: {
    code?: number;
    message?: string;
    logging?: boolean;
    context?: { [key: string]: any };
    errors?: any[];
  }) {
    let { code, message, logging, errors = [] } = params || {};

    console.log(errors);

    if (errors?.length > 0) {
      message = errors[0].msg;
    } else {
      errors.push({
        msg: message,
      });
    }

    super(message || 'Bad request');
    this._code = code || BadRequestError._statusCode;
    this._logging = logging || false;
    this._context = params?.context || {};
    this._errors = errors || [];

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  get errors() {
    return this._errors;
  }

  get statusCode() {
    return this._code;
  }

  get logging() {
    return this._logging;
  }
}
