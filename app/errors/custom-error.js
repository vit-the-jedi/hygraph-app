

class CustomError extends Error {
  constructor(message, information) {
    super(message);
    this.name = this.constructor.name;
    this.information = information;
    this.status = "error";
    this.information.message = message;
  }
}

export { CustomError };