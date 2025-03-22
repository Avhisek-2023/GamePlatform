export class Response {
  res;
  success;
  message;
  data;
  error;

  constructor(res, success, message, data, error) {
    this.res = res;
    this.success = success;
    this.message = message;
    this.data = data;
    this.error = error;
  }
  successs() {
    console.log("In");
    return this.res
      .status(201)
      .json({ success: this.success, message: this.message, data: this.data });
  }
  errorFun() {
    return this.res.status(201).json({
      success: this.success,
      message: this.message,
      error: this.error,
    });
  }
}
