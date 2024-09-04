"use client";

export default function LinkStatusDashboard({articleStatusInfo}){
  console.log('dashboard',(articleStatusInfo));
  for (const article of articleStatusInfo) {
    console.log('article', article);
  }

  const formattedData = articleStatusInfo.map((article, index, arr) => {
    const currentArticle = article[Object.keys(arr[index])[0]];
    return {
      id: index,
      status: currentArticle.status,
      link: currentArticle.link,
      message: currentArticle?.message,
      result: currentArticle?.result, 
      style: currentArticle.status === 'complete' ? 'bg-emerald-400 border-emerald-400' : 'bg-rose-800 border-rose-800',
    };
  });
  return (
    <div>
      <ol>
      {formattedData.map((article) => (
        <li key={article} className="my-3 relative">
          <div>
            <h5 className="text-lg">Article {article.id + 1}</h5>
            <span className={`status-indicator absolute border-1 rounded-full ${article.style} top-0 right-0 text-xs px-1`}>{article.status}</span>
            {article.message && <small>Message: {article.message}</small>}
            <small><a href={article.link}>{article.link}</a></small>
            {article.result && <p>Result: {article.result}</p>}
            {article.status === 'error' && 
              <div className="mt-3">
                <a href="/" className="mt-5 bg-yellow-500 rounded-md p-1 text-sm">Retry</a>
              </div>  
              }
          </div>  
          </li>
      ))}
    </ol>
    </div>
  );
}