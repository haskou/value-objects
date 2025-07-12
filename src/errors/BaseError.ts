export class BaseError extends Error {
  private readonly isBaseError = true;
  public static isBaseError(error: unknown): boolean {
    return !!(error as BaseError).isBaseError;
  }

  constructor(message: string, prototype: object = BaseError.prototype) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, prototype);
  }

  public toString(): string {
    return `[${this.name}]: ${this.message}`;
  }

  public getStack(): string {
    return this.stack || '';
  }
}
