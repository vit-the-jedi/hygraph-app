import { sendArticle } from "../../middleware/send-article.js";

export async function GET(request) {
  //must pass back an array here
  let info = [];
  const linkValues = request.nextUrl.searchParams.get("params").split(",");
  let i = 0;
  for (const link of linkValues) {
    const result = await sendArticle(link);
    const resObj = {};
    resObj.url = link;
    if (result?.errors?.length > 0) {
      resObj.status = "error";
      resObj.errors = [];
      result.errors.forEach((error) => {
        resObj.errors.push(error.message);
      });
      resObj.result = null;
    } else {
      resObj.status = "complete";
      resObj.result = result.data.createArticle.id;
    }
    info.push(resObj);
    i++;
  }
  return new Response(JSON.stringify(info,), {
    headers: { "Content-Type": "application/json" },
  });
}
//https://docs.google.com/document/d/18RXNr-4R_EMn2nb_hyWqQoJkhQbaamI2YO9XjqtWBAg/edit