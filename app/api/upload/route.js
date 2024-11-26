import { sendArticle } from "../../middleware/send-article.js";
import { HygraphRespError, GoogleAPIRespError } from "../../errors/api-errors.js";
import { CodeError } from "../../errors/code-errors.js";
import { CustomError} from "../../errors/custom-error.js";

export async function GET(request) {
  let allResponses = [];
  const linkValues = request.nextUrl.searchParams.get("params").split(",");
  const domain = request.nextUrl.searchParams.get("domain");
  let i = 0;

  try {
    // Create an array of promises
    const promises = linkValues.map((link) => sendArticle(link, domain));

    // Wait for all promises to settle
    const results = await Promise.allSettled(promises);

    // Process each result
    allResponses = results.map((res, i) => {
      console.log(res, i);
      if (res.status === "fulfilled") {
        return res.value;
      } else {
        // Handle rejected promises
        return res.reason;
      }
    });
  } catch (err) {
    // let resultWithError;
    // const article = err.article;
    // const url = err.url;
    // const id = err.id;
    // switch (err.information.type) {
    //   case "HygraphRespError":
    //     resultWithError = new HygraphRespError(err.message, article, url, id).createError();
    //     break;
    //   case "CodeError":
    //     resultWithError = new CodeError(err.message, err.stack, i).createError();
    //     break;
    //   case "GoogleAPIRespError":
    //     resultWithError = new GoogleAPIRespError(err.message, article, url, id).createError();
    //     break;
    //   default:
    //     resultWithError = new CodeError(err.message, err.stack, i).createError();
    // }
    // Add the error to the responses array

    //FIX : Need to keep promises resolving even after a rejection
    allResponses.push(resultWithError);
  }

  console.log((allResponses))
  // Return the responses
  return new Response(JSON.stringify(allResponses), {
    headers: { "Content-Type": "application/json" },
  });
}
