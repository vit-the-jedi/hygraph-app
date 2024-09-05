"use strict";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { google } = require("googleapis");
import { utils } from "./utils.js";
import { queries } from "./queries.js";
import { hygraphAst, transpileDocsAstToHygraphAst } from "./create-ast.js";

const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;

const article = {
  title: null,
  urlSlug: null,
  date: null,
  excerpt: null,
  content: null,
  metaKeywords: null,
  coverImage: null,
  articleType: 'article',
};

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ["https://www.googleapis.com/auth/documents"],
});

async function readDoc(documentId) {
  try {
    const doc = google.docs({ version: "v1", auth });
    const resp = await doc.documents.get({ documentId });
    return resp.data;
  } catch (err) {
    console.error(err);
  }
}

const sendArticle = async (link) => {
  return new Promise(async (resolve, reject) => {
    try {
      const docId = link.split('d/')[1].split('/')[0];
      console.log(docId);
      const docData = await readDoc(
        docId
      );
      transpileDocsAstToHygraphAst(docData.body.content);
      const imgUriArray = utils.extractImageUris(docData?.inlineObjects);
      const uploadResults = [];
      if(imgUriArray){
        for (const imgUri of imgUriArray) {
          uploadResults.push(await queries.uploadImage(imgUri));
        }
        article.coverImage = {connect: {id: `${uploadResults[0].data.createAsset.id}`}};
        if (uploadResults[1]) {
          article.secondaryImage = {connect: {id: `${uploadResults[1].data.createAsset.id}`}};
        }
        if (uploadResults[2]) {
          article.articleCardIcon = {connect: {id: `${uploadResults[2].data.createAsset.id}`}};
        }
      }

      article.title = hygraphAst.title;
      article.urlSlug = utils.generateSlug(hygraphAst.title);
      article.date = utils.generateDate();
      article.excerpt = hygraphAst.excerpt;
      article.content = hygraphAst.ast;
      article.metaKeywords = utils.extractMetaKeywords(hygraphAst.metaKeywords);
      
      const articleCreationResponse = await queries.sendArticle(article);
      console.log(articleCreationResponse);
      resolve(articleCreationResponse);
    } catch (err) {
      reject(err);
    }
  });
};


export { sendArticle, article };
setInterval(() => {}, 1000000);

