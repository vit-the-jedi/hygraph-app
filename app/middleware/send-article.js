"use strict";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { google } = require("googleapis");
import { utils } from "./utils.js";
import { queries } from "./queries.js";
import { transpileDocsAstToHygraphAst } from "./create-ast.js";

class Article {
  constructor() {
    this.title = null;
    this.urlSlug = null;
    this.date = null;
    this.excerpt = null;
    this.content = null;
    this.metaKeywords = null;
    this.coverImage = null;
    this.articleType = "article";
  }
}

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS),
  scopes: ["https://www.googleapis.com/auth/documents"],
});
async function readDoc(documentId) {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = google.docs({ version: "v1", auth });
      const resp = await doc.documents.get({ documentId });
      resolve(resp.data);
    } catch (err) {
      resolve({ errors: [{ message: err.errors[0].message }] });
    }
  });
}

const sendArticle = async (link, brand) => {
  return new Promise(async (resolve, reject) => {
    try {
      const article = new Article();
      const resp = {
        article: article,
        hygraphResp: null,
      };
      const docId = link.split("d/")[1].split("/")[0];
      const docData = await readDoc(docId);
      if (docData.errors) {
        resolve(docData);
      }
      const hygraphAst = transpileDocsAstToHygraphAst(docData.body.content);
      if (!hygraphAst)
        reject({ errors: [{ message: "Error transpiling document" }] });

      const imgUriArray = utils.extractImageUris(docData?.inlineObjects);
      const uploadResults = [];
      let uploadErrors;
      if (imgUriArray) {
        for (const imgUri of imgUriArray) {
          const imgUploadResult = await queries.uploadImage("skeee", brand);
          if(imgUploadResult.errors) uploadErrors.push(error);
          else uploadResults.push(imgUploadResult);
        }
        uploadErrors = uploadResults.filter((result) => {
          console.log(`yoooo`,(result));
          if (result.message || result.data.createAsset.size === null) {
            return result;
          }
        });
        console.log(`errors`,uploadErrors[0].data.createAsset);
        if (!uploadErrors) {
          article.coverImage = {
            connect: { id: `${uploadResults[0].data.createAsset.id}` },
          };
          if (uploadResults[1]) {
            article.secondaryImage = {
              connect: { id: `${uploadResults[1].data.createAsset.id}` },
            };
          }
          if (uploadResults[2]) {
            article.articleCardIcon = {
              connect: { id: `${uploadResults[2].data.createAsset.id}` },
            };
          }
        }
      }
      article.title = hygraphAst.title;
      article.urlSlug = utils.generateSlug(hygraphAst.title);
      article.date = utils.generateDate();
      article.excerpt = hygraphAst.excerpt;
      article.content = hygraphAst.ast;
      article.metaKeywords = hygraphAst.metaKeywords;

      //if there was an error creating the assets, return with an error
      if(uploadErrors) {
        resp.hygraphResp = {};
        resp.hygraphResp.errors = uploadErrors.map((e) => {
          return { message: e.message ? e.message : "Error uploading image(s)" };
        });
      }else {
        const articleCreationResponse = await queries.sendArticle(article, brand);
        resp.hygraphResp = articleCreationResponse;
      }
      resolve(resp);
    } catch (err) {
      reject({ errors: [{ message: err.message ? err.message : err }] });
    }
  });
};

export { sendArticle, Article };
