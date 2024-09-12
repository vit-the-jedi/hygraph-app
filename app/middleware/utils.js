"use strict";



import fs from "fs";
const utils = {
  generateSlug: (title) => {
    try {
      const trimmed = title.split(" ").reduce((acc, curr, i, arr) => {
        if (i <= 4) {
          acc.push(curr.toLowerCase());
        }
        return acc;
      }, []);
      const currentYear = String(new Date().getFullYear());
      if (title.includes(currentYear)) {
        trimmed.push(currentYear);
      }
      const slug = trimmed.join("-");
      return slug;
    } catch (error) {
      console.log(`Error geenrating slug: ${error}`);
      return null;
    }
  },
  generateDate: () => {
    try {
      return new Date().toISOString().split("T")[0];
    }catch(e){
      console.log(`Error generating date: ${e}`);
      return null;
    } 
  },
  extractTitle: (text) => { 
    const regex = /title:/gmi;
    try{
      const m = text.match(regex);
      if(m) return text.replace(regex,"").replace(/\r?\n|\r/g, " ").trim();
      else return null;
    }catch(e){
      return null;
    }
  },
  extractExcerpt: (text) => {
    const regex = /excerpt:/gmi;
    try{
      const m = text.match(regex);
      const t = text.replace(regex, "").replace(/\r?\n|\r/g, " ").trim();
      if(m) return t;
      else return null;
    }catch(e){
      return null;
    }
  },
  extractMetaKeywords: (metaKeywords) => {
    try{
      const keywords = metaKeywords.match(/content="(.*?)"/);
      return keywords[0].replace("content=","").replaceAll('"', "").replace(/\r?\n|\r/g, " ");
    }catch(e){
      return null;
    } 
  },
  extractImageUris: (data) => {
    try {
      const arr = Object.keys(data).map((key) => {
        return data[key].inlineObjectProperties.embeddedObject.imageProperties.contentUri;
      });
      return arr;
    } catch (error) {
      console.log(`No images found in document, proceeding...`);
      return null;
    }
  },
  /* can upload by url to hygraph - but doesn't hurt to have this */
  downloadImage: async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to download image");
      }
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  saveBlobToDisk: async (blob, filePath) => {
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    fs.writeFileSync(filePath, buffer);
  },
};

export { utils };
