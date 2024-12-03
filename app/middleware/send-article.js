
"use strict";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { google } = require("googleapis");
import { utils } from "./utils.js";
import { queries } from "./queries.js";
import { transpileDocsAstToHygraphAst } from "./create-ast.js";
import { CustomError } from "../errors/custom-error.js";


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
    this.contentTag = null;
  }
}

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS),
  scopes: ["https://www.googleapis.com/auth/documents"],
});
async function readDoc(documentId, documentLink) {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = google.docs({ version: "v1", auth });
      const resp = await doc.documents.get({ documentId });
      resolve(resp.data);
    } catch (err) {
      reject(new CustomError(err.errors[0].message, {type: "GoogleRespError"}));
    }
  });
}
/**
 * Sends an article to Hygraph by reading a Google Doc, transpiling its content, and uploading it.
 *
 * @param {string} link - The link to the Google Doc.
 * @param {string} domain - The domain associated with the article.
 * @returns {Promise<Object>} A promise that resolves to an object containing the article and the result of the upload.
 * @throws {CustomError} Throws a custom error if any step in the process fails. Custom errors should have a type passed.
 * @see CustomError
 */
const sendArticle = async (link, domain) => {
  return new Promise(async (resolve, reject) => {
    const article = new Article();
    const hygraphApiResp = {
      article: article,
      result: null,
      status: "complete",
      url: link,
      id: null,
    };
    try {
      const docId = link.split("d/")[1].split("/")[0];
      const docData = await readDoc(docId, link);
      //if hygraph responds with an array of errors, throw the first one
      if (docData.errors) {
        reject(new CustomError(docData.errors[0].message, {type: "GoogleRespError"}));
      }
      const hygraphAst = transpileDocsAstToHygraphAst(docData.body.content);
      //if there is an issue creating the AST, throw an error
      //currently, a generic error is thrown from the catch block below, but the error could be
      //in any part of the AST creation process either in create-ast.js or utils.js
      //if no code errors occur, but the AST is not created, the error will be thrown from here
      if (!hygraphAst)
        reject(new CustomError('Error transpiling document', {type: "HygraphRespError"}));
      const imgUriArray = utils.extractImageUris(docData?.inlineObjects);
      const uploadResults = [];
      let uploadErrors;
      //check if there are images in the google document
      if (imgUriArray) {
        for (const imgUri of imgUriArray.slice().reverse()) {
          const imgUploadResult = await queries.uploadImage(imgUri);
          //check if hygraph sent back an error
          if(imgUploadResult.errors) uploadErrors = imgUploadResult.errors.map((e)=>e);
          else uploadResults.push(imgUploadResult);
        }
        //if we have an upload response and it contains errors, reject the promise
        if(uploadResults.length > 0 && uploadResults[0].errors){
          reject(new CustomError('Error uploading image(s)', {type: "HygraphRespError"}));
        }else {
          //hygraph doesn't throw an error for incorrect image formats, so we need to check for that here
          uploadErrors = uploadResults.filter((result) => {
            if (result.message) {
              return result;
            }
          });
        }
        //if no errors in image upload, continue on with the article creation
        if (uploadErrors.length === 0) {
          //console.log(`UPLOAD RESULTS`, uploadResults);
          article.coverImage = {
            connect: { id: utils.locateUploadResultId(uploadResults[0])},
          };
          //console.log(`COVER IMAGE`, article.coverImage);
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
      if (hygraphAst.contentTag.length > 0) {
        const connectTagsObj = {};
        //check hygraph to see if the tags in the document already exist
        const tagsFound = await queries.searchForTags(hygraphAst.contentTag.map((tag) => tag.tagValue));
        //if yes, save them to connect to the article     
        const tagsToConnect = tagsFound.data.contentTag.map((tag) => tag );
        //the remaining tags need to be created
        //filter out the ones that are already in hygraph, add the rest to the create array
        const tagsToCreate = hygraphAst.contentTag.filter((tag) => {
          return !tagsToConnect.some((tagToConnect) => tagToConnect.tagValue === tag.tagValue);
        })
        //create the connect object for the article, removing the tagValue property and only passing id
        connectTagsObj.connect = tagsToConnect.map((tag) => {return {id: tag.id}});
        connectTagsObj.create = tagsToCreate;
  
        //console.log(`CONNECT TAGS OBJ: `, connectTagsObj);
        article.contentTag = connectTagsObj;
      }
      //set all article properties
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

      //upload the article
      const articleCreationResponse = await queries.uploadArticle(article);

      hygraphApiResp.result = articleCreationResponse.data;
      //errors from hygraph will be in the errors array
      if(articleCreationResponse.errors) {
        reject(new CustomError(articleCreationResponse.errors[0].message, {type: "HygraphRespError"}));
      }
      resolve(hygraphApiResp);
    } catch (err) {
      //catch-all for any code errors that pop up in article creation
      //again, these code errors can surface from anywhere in the article creation tree
      //the stack trace may will lead here, but the error could be in any of the underlying functions or imports
      reject(new CustomError(err.message, {type: "CodeError", stack: err.stack}));
    }
  });
};

export { sendArticle, Article };
