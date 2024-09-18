"use client";

import SecondaryButton from "./buttons/SecondaryButton";

// const goToHome = (event) => {
//   event.preventDefault();
//   sessionStorage.clear();
//   window.location.href = '/';
// }

export default function LinkStatusDashboard({ articleStatusInfo }) {
  const formattedData = articleStatusInfo.map((articleInfo, index, arr) => {
    return {
      articleData: articleInfo.article,
      id: index,
      status: articleInfo.status,
      link: articleInfo.url,
      message: articleInfo?.errors,
      result: articleInfo?.result,
      style:
        articleInfo.status === "complete"
          ? "bg-emerald-400 border-emerald-400"
          : "bg-rose-800 border-rose-800",
    };
  });

  const getCompletedContentEntry = (id) => {
    const contentLink =
      "https://studio-us-east-1-shared-usea1-02.hygraph.com/dc387f44-9a95-4765-a5e2-581e6ba87d32/74c032da3f0541dc8c6df0cf670523b0/content/b619711b3d264e0aa7a28714ea8978d1/entry/";
    return `${contentLink}${id}`;
  };

  const brand = new URLSearchParams(window.location.search).get("brand");

  const cmsContentEntryLink =
    brand === "0"
      ? "https://studio-us-east-1-shared-usea1-02.hygraph.com/dc387f44-9a95-4765-a5e2-581e6ba87d32/74c032da3f0541dc8c6df0cf670523b0/content/b619711b3d264e0aa7a28714ea8978d1/entry/"
      : "https://studio-us-east-1.hygraph.com/bdc6b387-416f-4e4f-ac4e-3c5a86f132ff/945c8f79b15c4fc0b11fd1a585e23d07/content/b640f1612d82410d853f23cf500d0364/entry/";

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
              <h2 className="text-2xl pb-1">
                Title: {article.articleData.title}
              </h2>
              <span
                className={`status-indicator absolute border-1 rounded-full ${article.style} top-2 right-2 text-xs px-1`}
              >
                {article.status}
              </span>

              {article.status === "error" && (
                <p>
                  Message:{" "}
                  <a
                    href={`#error-${article.id}`}
                    className="text-rose-500 underline"
                  >
                    {article.message[0]}
                  </a>
                </p>
              )}

              {article.result && (
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

              <div className="my-3">
                <span className="text-xs">URL: </span>
                <a className="text-xs underline" href={article.link}>
                  {article.link}
                </a>
              </div>

              {article.status === "error" && (
                <div className="mt-3">
                  {/* <SecondaryButton style={{marginLeft: '-40px'}} buttonConfig={{text:"Retry", onClick: goToHome}} /> */}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
