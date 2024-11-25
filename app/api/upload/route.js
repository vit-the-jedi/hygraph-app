import { sendArticle } from "../../middleware/send-article.js";
import { HygraphRespError, GoogleAPIRespError } from "../../errors/api-errors.js";
import { CodeError } from "../../errors/code-errors.js";
import { CustomError} from "../../errors/custom-error.js";

export async function GET(request) {
  //must pass back an array here
  let allResponses;
  const linkValues = request.nextUrl.searchParams.get("params").split(",");
  const domain = request.nextUrl.searchParams.get("domain");
  let i = 0;
  try {
    const promises = linkValues.map((link, i, arr) => {
      return sendArticle(link, domain);
    });
    allResponses = (await Promise.allSettled(promises)).map((res) => {
      if (res.status === "fulfilled") {
        return res.value;
      } else {
        //promise rejections from either queries.js or send-articles.js contain a CustomError object
        //throw custom error here, resulting to rejected promise
        throw res.reason;
      }
    });
  } catch (err) {
    console.log(`API ERROR: `, (err));
    let resultWithError;
    switch(err.information.type){
      case "HygraphRespError":
        resultWithError = new HygraphRespError(err.message, err.res, err.url, i).createError();
        break;
      case "CodeError":
        resultWithError = new CodeError(err.message, err.stack, i).createError();
        break;
        case "GoogleAPIRespError":
          resultWithError = new GoogleAPIRespError(err.message, err.res, err.url, i).createError();
          break;
      default:
        resultWithError = new CodeError(err.message, err.stack, i).createError();
    }
    //resultWithError = new CodeError(err.message, err.stack, i).createError();
    //console.log(`API CODE ERROR`, resultWithError);
    return new Response(JSON.stringify([resultWithError]), {
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response(JSON.stringify(allResponses), {
    headers: { "Content-Type": "application/json" },
  });
}
//https://docs.google.com/document/d/18RXNr-4R_EMn2nb_hyWqQoJkhQbaamI2YO9XjqtWBAg/edit
