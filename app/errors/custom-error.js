

/**
 * CustomError class extends the built-in Error class to include additional information.
 * We use this error across the app to generate relevant information to the end user.
 * Errors can originate from api calls, middleware, or other parts of the app.
 * 
 * @class CustomError
 * @extends {Error}
 * 
 * @param {string} message - The error message.
 * @param {Object} information - Additional information about the error.
 *  * @param {string} information.type - The type of error - CodeError, HygraphRespError, GoogleRespError, or NextJSRouterError.
 * @param {string} information.message - The error message.
 * @param {string} [information.stack] - The stack trace of the error.
 * 
 */
class CustomError extends Error {
  constructor(message, information) {
    super(message);
    this.name = this.constructor.name;
    this.information = information;
    this.status = "error";
    this.information.message = message;
    this.information.stack = this?.stack;
  }
}

export { CustomError };