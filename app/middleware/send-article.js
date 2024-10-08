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
    this.domain = null;
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

const sendArticle = async (link, domain) => {
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
      console.log(`AST`, (hygraphAst));
      if (!hygraphAst)
        reject({ errors: [{ message: "Error transpiling document" }] });
      const imgUriArray = utils.extractImageUris(docData?.inlineObjects);
      const uploadResults = [];
      let uploadErrors;
      if (imgUriArray) {
        for (const imgUri of imgUriArray.slice().reverse()) {
          const imgUploadResult = await queries.uploadImage(imgUri);
          //check if hygraph sent back an error
          if(imgUploadResult.errors) uploadErrors = imgUploadResult.errors.map((e)=>e);
          else uploadResults.push(imgUploadResult);
        }
        if(uploadResults[0].error){
          resp.hygraphResp = {};
          resp.hygraphResp.errors = [{ message: uploadResults[0].error }]
          resolve(resp);
        }else {
          //hygraph doesn't throw an error for incorrect image formats, so we need to check for that here
          uploadErrors = uploadResults.filter((result) => {
            if (result.message) {
              return result;
            }
          });
        }
        //if no errors, continue on with the article creation
        if (uploadErrors.length === 0) {
          console.log(`UPLOAD RESULTS`, uploadResults);
          //${uploadResults[0].data.createAsset.id}
          article.coverImage = {
            connect: { id: utils.locateUploadResultId(uploadResults[0])},
          };
          console.log(`COVER IMAGE`, article.coverImage);
          if (uploadResults[1]) {
            article.secondaryImage = {
              connect: { id: utils.locateUploadResultId(uploadResults[1])},
            };
          }
          if (uploadResults[2]) {
            article.articleCardIcon = {
              connect: { id: utils.locateUploadResultId(uploadResults[2])},
            };
          }
        }
      }
      const genericSubvertical = domain === "findhomepros.com" ? "home-services" : "insurance";
      article.articleType = hygraphAst.articleType || "article";
      article.title = hygraphAst.title;
      article.urlSlug = utils.generateSlug(hygraphAst.title);
      article.date = utils.generateDate();
      article.excerpt = hygraphAst.excerpt;
      article.content = hygraphAst.ast;
      article.metaKeywords = hygraphAst.metaKeywords;
      article.vertical = hygraphAst.vertical || genericSubvertical;
      article.subvertical = hygraphAst.subvertical || null;
      article.readTime = hygraphAst.readTime || "5 min read";
      article.domain = utils.transformDomainToHygraphAPIRef(domain);

      //if there was an error creating the assets, return with an error
      //should find a way to do this earlier and save computation
      const articleCreationResponse = await queries.uploadArticle(article);
      resp.hygraphResp = articleCreationResponse;
      resolve(resp);
    } catch (err) {
      console.trace();
      console.log(err);
      reject({ errors: [{ message: err.message ? err.message : err }] });
    }
  });
};

export { sendArticle, Article };
