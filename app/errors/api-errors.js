export class HygraphRespError extends Error {
  constructor(message, res, url, id) {
    super(message);
    this.name = "HygraphRespError";
    this.id = id;
    this.url = url;
    this.status = "error";
    this.result = null;
    this.article = res.article;
    this.errors = [{message: message, type: this.name}];
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

export class GoogleAPIRespError extends Error {
  constructor(message, res, url, id) {
    console.log(url)
    super(message);
    this.name = "GoogleAPIRespError";
    this.id = id;
    this.url = url;
    this.status = "error";
    this.result = res;
    this.errors = [{message: message, type: this.name}];
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