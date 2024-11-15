import { sendArticle } from "../../middleware/send-article.js";

export async function GET(request) {
  //must pass back an array here
  let info = [];
  const linkValues = request.nextUrl.searchParams.get("params").split(",");
  const domain = request.nextUrl.searchParams.get("domain");
  let i = 0;

  const createErrorResponse = (res, url, id) => {
    const errorResObj = {};
    errorResObj.id = id;
    errorResObj.url = url;
    errorResObj.status = "error";
    errorResObj.result = null;
    errorResObj.hygraphResp = res.hygraphResp;
    errorResObj.article = res.article;
    info.push(errorResObj);
  };
  const createSuccessResponse = (res, url, id) => {
    const successResObj = {};
    errorResObj.id = id;
    errorResObj.url = url;
    successResObj.status = "complete";
    successResObj.result = res.hygraphResp.data.createArticle;
    successResObj.article = res.article;
    info.push(successResObj);
  }
  try {
    for (const link of linkValues) {
      // console.log(`SENDING ARTICLE:`, link);
      const result = await sendArticle(link, domain);
      console.log(`SEND ARTICLE RESULT:`, result);

      if(result.hygraphResp.errors){
        createErrorResponse(result, link, i);
      }else {
        createSuccessResponse(result, link, i);
      }
      i++;
    }
  } catch (resultWithError) {
    console.log(`API ERROR`, resultWithError);
    createErrorResponse(resultWithError);
  }
  console.log(`INFO:`, info);
  return new Response(JSON.stringify(info), {
    headers: { "Content-Type": "application/json" },
  });
}
//https://docs.google.com/document/d/18RXNr-4R_EMn2nb_hyWqQoJkhQbaamI2YO9XjqtWBAg/edit
