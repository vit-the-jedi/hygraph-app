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
  searchForTags: async function (tags) {
        const query = `query searchTags($tags: [String!]!) {
  contentTag(stage: DRAFT where: {tagValue_in: $tags}) {
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
              tags: tags,
            },
          }),
        });
        const respJSON = await response.json();
        console.log("HYGRAPH RESPONSE: ", respJSON);
        if (respJSON.errors) {
          if(process.env.NODE_ENV === "development") console.log(`HYGRAPH ERROR: `, respJSON.errors);
          reject(respJSON.errors);
        }
        resolve(respJSON);
      } catch (err) {
        console.log("HYGRAPH ERROR: ", err);
        reject(err);
      }
    })
  },
  createTag: async function (tag) {
    const query = `mutation createContentTag($tag: ContentTagCreateInput!){
                    createContentTag(data: $tag)
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
              tag: tag,
            },
          }),
        });
        const respJSON = await response.json();
        console.log("HYGRAPH RESPONSE: ", respJSON);
        if (respJSON.errors) {
          if(process.env.NODE_ENV === "development") console.log(`HYGRAPH ERROR: `, respJSON.errors);
          reject(respJSON.errors);
        }
        resolve(respJSON);
      } catch (err) {
        console.log("HYGRAPH ERROR: ", err);
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
        //console.log("HYGRAPH RESPONSE: ", respJSON);
        if (respJSON.errors) {
         if(process.env.NODE_ENV === "development") console.log(`HYGRAPH RESPONSE ERROR: `, respJSON.errors.map((error) => error.message));
         const errorObj = {
           errors: respJSON.errors.map((error) => {return {message: error.message}}),
         }
          reject(errorObj);
        }
        resolve(respJSON);
      } catch (err) {
        console.log("HYGRAPH FETCH ERROR: ", err);
        reject({error: {message: err}});
      }
    });
  },
};

export { queries };
