import { sendArticle } from "../../middleware/send-article.js";

export async function GET(request) {
  //must pass back an array here
  let info = [];
  const linkValues = request.nextUrl.searchParams.get("params").split(",");
  const domain = request.nextUrl.searchParams.get("domain");
  let i = 0;
  const resObj = {};
  try {
    for (const link of linkValues) {
      const result = await sendArticle(link, domain);
      console.log(`SEND ARTICLE RESULT:`, result);
      resObj.article = result.article;
      resObj.url = link;
      resObj.id = i;

      resObj.status = "complete";
      resObj.result = result.hygraphResp?.data?.createArticle?.id;
      info.push(resObj);
      i++;
    }
  } catch (resultWithError) {
    console.log(`API ERROR`, resultWithError);
    resObj.status = "error";
    resObj.result = null;
    resObj.article = resultWithError.article;
    resObj.url = linkValues[i];
    resObj.id = i;
    resObj.hygraphResp = resultWithError.hygraphResp;
    info.push(resObj);
  }
  return new Response(JSON.stringify(info), {
    headers: { "Content-Type": "application/json" },
  });
}
//https://docs.google.com/document/d/18RXNr-4R_EMn2nb_hyWqQoJkhQbaamI2YO9XjqtWBAg/edit
