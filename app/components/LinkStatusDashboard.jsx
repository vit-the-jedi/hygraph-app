"use client";

import SecondaryButton from "./buttons/SecondaryButton";

// const goToHome = (event) => {
//   event.preventDefault();
//   sessionStorage.clear();
//   window.location.href = '/';
// }

export default function LinkStatusDashboard({ articleStatusInfo }) {
  const formattedData = articleStatusInfo.map((articleInfo, index, arr) => {
    let message = null;
    let stack = null;
    let errorType = null;
    if (articleInfo.status === "error") {
      message = articleInfo.information.message;
      stack = articleInfo.information.stack;
      errorType = articleInfo.information.type;
    }
    const result = {
      articleData: articleInfo?.article,
      id: index,
      status: articleInfo.status,
      link: articleInfo?.information?.url ? articleInfo?.information?.url : articleInfo?.url,
      style:
      articleInfo.status === "complete"
        ? "bg-emerald-400 border-emerald-400"
        : "bg-rose-800 border-rose-800",
    };

    if (message) result.message = message;
    if (stack) result.stack = stack;
    if (errorType) result.errorType = errorType;
    if (articleInfo?.result?.createArticle?.id) result.result = articleInfo.result.createArticle.id;

    return result;
  });
  console.log(formattedData);

  const getCompletedContentEntry = (id) => {
    const contentLink =
      "https://studio-us-east-1-shared-usea1-02.hygraph.com/dc387f44-9a95-4765-a5e2-581e6ba87d32/74c032da3f0541dc8c6df0cf670523b0/content/b619711b3d264e0aa7a28714ea8978d1/entry/";
    return `${contentLink}${id}`;
  };

  const brand = new URLSearchParams(window.location.search).get("brand");

  const cmsContentEntryLink =
    "https://studio-us-west-2.hygraph.com/f187a37f-90fe-4ea2-967e-7efd4c0705d3/8766b78326054b9cbd4810df21fa899e/content/3dcdcab60a1f4ab28e8ee37dbac18ded/entry/";
  return (
    <section>
      <ol>
        {formattedData.map((article, i, arr) => (
          <li key={i} className="my-3 relative">
            <div
              className={`border-2 p-3 rounded-md bg-indigo-900 ${
                article.status === "error"
                  ? "border-rose-500"
                  : "border-emerald-400"
              }`}
            >
              <h3 className="mb-5 text-1xl">Entry {article.id + 1}</h3>
              {article?.articleData?.title ? (
                <h2 className="text-2xl pb-1">
                  Title: {article.articleData.title}
                </h2>
              ) : (
                <h2 className="text-2xl pb-1">
                  {article?.errorType === "GoogleRespError" && <span>There was an error before parsing the document</span>}
                  {article?.errorType === "HygraphRespError" && <span>There was an error uploading the document</span>}
                  {article?.errorType === "NextJSRouterError" || article?.errorType === "CodeError" && <span>There was an internal error</span>}

                </h2>
              )}

              <span
                className={`status-indicator absolute border-1 rounded-full ${article.style} top-2 right-2 text-xs px-1`}
              >
                {article.status}
              </span>

              {article.status === "error" && (
                <div>
                  <p>
                    Message:{" "}
                    <a
                      href={`#error-${article.id}`}
                      className="text-rose-500 underline"
                    >
                      {article.message}
                    </a>
                  </p>
                  <p>
                    <br />
                    <br />
                    Error Type: <span>{article.errorType}</span>
                    <br />
                    <br />
                  </p>
                  {article.stack && <p className="text-xs">
                    Stack Trace:
                    <br />
                    {article.stack}
                  </p>}
                </div>
              )}

              {article?.result && (
                <div>
                  <p>Result Id: {article.result} </p>
                  <SecondaryButton
                    buttonConfig={{
                      text: "View Article",
                      onClick: () => {
                        window.open(
                          cmsContentEntryLink + article.result,
                          "_blank"
                        );
                      },
                    }}
                  />
                </div>
              )}

              {article.link && (
                <div className="my-3">
                  <span className="text-xs">URL: </span>
                  <a
                    className="text-xs underline"
                    target="_blank"
                    href={article.link}
                  >
                    {article.link}
                  </a>
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
