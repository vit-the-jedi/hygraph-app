

class CustomError extends Error {
  constructor(message, information) {
    super(message);
    this.name = this.constructor.name;
    this.information = information;
  }
}

export { CustomError };