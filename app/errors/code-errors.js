import { type } from "os";

export class CodeError extends Error {
  constructor(message, stack, id) {
    super(message);
    this.name = "CodeError";
    this.id = id;
    this.url = null;
    this.status = "error";
    this.result = null;
    this.errors = [{message: message, type: this.name, stack: stack}];
    this.article = null;
  }
  createError(){
    return {
      id: this.id,
      url: this.url,
      errors: this.errors,
      status: this.status,
      result: this.result,
      article: this.article,
    }
  }
}