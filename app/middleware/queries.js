"use strict";

const queries = {
  uploadImage: async function (uri) {
    console.log(`UPLOADING IMAGE: `, uri);
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(`${process.env.API_URL}`, {
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
      } catch (err) {
        reject(err);
      }
    });
  },
  uploadImageLegacy: async function (uri) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(`${apiKeyMap[brand].url}/upload`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            //Authorization: `Bearer ${apiKeyMap[brand].key}`,
          },
          body: `url=${encodeURIComponent(
            uri
          )}`,
        });
        const respJSON = await response.json();
        console.log(`LEGACY RESPONSE: `, respJSON);
        resolve(respJSON);
      } catch (err) {
        reject(err);
      }
    });
  },
  uploadArticle: async function (article) {
    const query = `mutation createArticle($article: ArticleCreateInput!){
                    createArticle(data: $article)
                      {
                        id
                      }
                    }`;
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(process.env.API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${apiKeyMap[brand].key}`,
          },
          body: JSON.stringify({
            query: query,
            variables: {
              article: article,
            },
          }),
        });
        const respJSON = await response.json();
        console.log("HYGRAPH RESPONSE: ", respJSON);
        resolve(respJSON);
      } catch (err) {
        console.log("HYGRAPH ERROR: ", err);
        reject(err);
      }
    });
  },
};

export { queries };
