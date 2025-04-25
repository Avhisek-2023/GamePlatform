export class Response {
  res;
  success;
  status;
  message;
  data;
  error;

  constructor(res, success, status, message, data, error) {
    this.res = res;
    this.success = success;
    this.status = status;
    this.message = message;
    this.data = data;
    this.error = error;
  }
  successs() {
    return this.res
      .status(201)
      .json({ success: this.success, status: this.status, message: this.message, data: this.data });
  }
  errorFun() {
    return this.res.status(201).json({
      success: this.success,
      status: this.status,
      message: this.message,
      error: this.error,
    });
  }
}
