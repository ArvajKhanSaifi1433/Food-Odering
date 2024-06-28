class ApiError {
  constructor(statusCode, message = "Something went wrong") {
    this.statusCode = statusCode;
    this.message = message;
    this.suceess = statusCode < 400;
  }
}

export { ApiError };
