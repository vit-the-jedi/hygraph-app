"use strict";

const apiKeyMap = {
  "0": {
    key: process.env.FHP_API_KEY,
    url: process.env.FHP_API_URL,
  },
  "1": {
    key: process.env.PROTECT_API_KEY,
    url: process.env.PROTECT_API_URL,
  },
}


const queries = {
  uploadImage: async function (uri, brand){
    console.log('URI ' + uri);
  return new Promise(async(resolve, reject)=>{
    try{
      const response = await fetch(apiKeyMap[brand].url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${apiKeyMap[brand].key}`,
        },
        body: JSON.stringify({
          query: `mutation uploadArticleImage{
                createAsset(
                  data: {
                    uploadUrl:"${uri}"
                  }
                ) {
                  id,
                  url
                }
              }`,
        }),
      });
      const respJSON = await response.json();
      resolve(respJSON);  
    }catch(err){  
      reject(err);
    }
  });
  },
  uploadArticle: async function(article, brand){
    const query = `mutation createArticle($article: ArticleCreateInput!){
                    createArticle(data: $article)
                      {
                        id
                      }
                    }`;
    return new Promise(async(resolve, reject)=>{
      try{
        const response = await fetch(apiKeyMap[brand].url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${apiKeyMap[brand].key}`,
          },
          body: JSON.stringify({ 
            query: query,
            variables: {
              article: article,
            }
           }),
        });
        const respJSON = await response.json();
        console.log("HYGRAPH RESPONSE: ", respJSON);  
        resolve(respJSON);  
      }catch(err){  
        console.log("HYGRAPH RESPONSE: ", err);  
        reject(err);
      }
    });
  }, 
}

export {queries};