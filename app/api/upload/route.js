import { sendArticle } from "../../middleware/send-article.js";

export async function GET(request) {
  //must pass back an array here
  let info = [];
  const linkValues = request.nextUrl.searchParams.get("params").split(",");
  const domain = request.nextUrl.searchParams.get("domain");
  let i = 0;
  try {
    for (const link of linkValues) {
      const result = await sendArticle(link, domain);
      console.log(`SEND ARTICLE RESULT:`, result);
      const resObj = {};
      resObj.article = result.article;
      resObj.url = link;
      resObj.id = i;

      resObj.status = "complete";
      resObj.result = result.hygraphResp?.data?.createArticle?.id;
      info.push(resObj);
      i++;
    }
    return new Response(JSON.stringify(info), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const errorObj = {
      errors: err.map((error) => {
        return { message: error };
      }),
    }
    console.log(`API ERROR`, errorObj);
    return new Response(JSON.stringify(errorObj), {
      headers: { "Content-Type": "application/json" },
    });
  }
}
//https://docs.google.com/document/d/18RXNr-4R_EMn2nb_hyWqQoJkhQbaamI2YO9XjqtWBAg/edit
