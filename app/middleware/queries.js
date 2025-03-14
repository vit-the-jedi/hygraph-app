"use strict";
import { CustomError } from "../errors/custom-error.js";
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
        if(respJSON.errors){
          reject(new CustomError(respJSON.errors[0].message, {type: "HygraphRespError"}));
        }
        resolve(respJSON);
      } catch (err) {
        reject(new CustomError(err.message, {type: "CodeError"}));
      }
    });
  },
  uploadImageLegacy: async function (uri) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(`${process.env.API_URL}/upload`, {
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
        if(respJSON.errors){
          reject(new CustomError(respJSON.errors[0].message, {type: "HygraphRespError"}));
        }
        resolve(respJSON);
      } catch (err) {
        reject(new CustomError(err.message, {type: "CodeError"}));
      }
    });
  },
  searchForTags: async function (tags) {
        const query = `query searchTags($tags: [String!]!) {
  contentTag(stage: DRAFT where: {tagValue_in: $tags}) {
    id,
    tagValue
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
        if(respJSON.errors){
          reject(new CustomError(respJSON.errors[0].message, {type: "HygraphRespError"}));
        }
        resolve(respJSON);
      } catch (err) {
        reject(new CustomError(err.message, {type: "CodeError"}));
      }
    })
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
        if(respJSON.errors){
          reject(new CustomError(respJSON.errors[0].message, {type: "HygraphRespError"}));
        }
        resolve(respJSON);
      } catch (err) {
        reject(new CustomError(err.message, {type: "CodeError"}));
      }
    });
  },
};

export { queries };
