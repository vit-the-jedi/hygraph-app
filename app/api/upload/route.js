import { sendArticle } from "../../middleware/send-article.js";

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
    console.log(err);
    //FIX : Need to keep promises resolving even after a rejection
    allResponses.push({
      status: "error",
      information: {
        message: err.message,
        stack: err.stack,
        type: "NextJSRouterError",
      },
    });
  }
  // Return the responses
  return new Response(JSON.stringify(allResponses), {
    headers: { "Content-Type": "application/json" },
  });
}
