"use client";
import PrimaryButton from "./buttons/PrimaryButton";
export default function LinkStatusDashboard({articleStatusInfo}){

  const goToHome = (event) => {
    event.preventDefault();
    window.location.href = '/';
  }
  const formattedData = articleStatusInfo.map((article, index, arr) => {
    const currentArticle = article[Object.keys(arr[index])[0]];
    return {
      id: index,
      status: currentArticle.status,
      link: Object.keys(arr[index])[0],
      message: currentArticle?.message,
      result: currentArticle?.result, 
      style: currentArticle.status === 'complete' ? 'bg-emerald-400 border-emerald-400' : 'bg-rose-800 border-rose-800',
    };
  });

  const getCompletedContentEntry = (id) => {
    const contentLink = 'https://studio-us-east-1-shared-usea1-02.hygraph.com/dc387f44-9a95-4765-a5e2-581e6ba87d32/74c032da3f0541dc8c6df0cf670523b0/content/b619711b3d264e0aa7a28714ea8978d1/entry/';
    return `${contentLink}${id}`;
  }

  return (
    <div>
      <ol>
      {formattedData.map((article) => (
        <li key={article} className="my-3 relative">
          <div className={`border-2 p-3 rounded-md ${article.message ? 'border-rose-500' : 'border-emerald-400'}`}>
            <h4 className="text-xl">Article {article.id + 1}</h4>
            <span className={`status-indicator absolute border-1 rounded-full ${article.style} top-2 right-2 text-xs px-1`}>{article.status}</span>
            
            {article.message && <p>Message: <span className="text-rose-500">{article.message}</span></p>}
            
            <div className="my-3">
              <a className="text-xs underline" href={article.link}>{article.link}</a>
            </div>

            {article.result && 
              <div>
                <p>Result Id: {article.result} </p>
                <a href={getCompletedContentEntry(article.result)} target="_blank" className="text-xs underline">View Content Entry</a>
              </div>
            }

            {article.status === 'error' && 
              <div className="mt-3">
                <PrimaryButton buttonConfig={{text:"Retry", onClick: goToHome}} />
              </div>  
              }
          </div>  
          </li>
      ))}
    </ol>
    </div>
  );
}