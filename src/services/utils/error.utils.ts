class AppError extends Error {
  public constructor(
    public msg: string,
    public code?: number | null,
    public dataToSend?: any,
    public severity: SEVERITY = SEVERITY.ERROR
  ) {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, AppError.prototype);
  }

  printErrorMessage() {
    return "message: " + this.message + " stack: " + this.stack;
  }
}

export enum SEVERITY {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  DEBUG = "debug",
}
export { AppError };

