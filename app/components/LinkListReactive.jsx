"use client";
import { useState } from "react";

export default function LinkListReactive({articlesInfo}) {
  const [articles] = useState(Object.keys(articlesInfo));
  console.log(articles);
  return(
    <ol>
      {articles.map((article) => (
        <li key={article} className={article.status}>
          <div>
            <p>{article}</p>
            <p>{article.id}</p>
            <p>{article.cmsLink}</p>
          </div>  
          </li>
      ))}
    </ol>
  )
}