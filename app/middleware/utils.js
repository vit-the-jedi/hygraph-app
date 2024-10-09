"use strict";



import fs from "fs";
const utils = {
  generateSlug: (title) => {
    try {
      const trimmed = title.split(" ").reduce((acc, curr, i, arr) => {
        if (i <= 10) {
          acc.push(curr.toLowerCase());
        }
        return acc;
      }, []).filter((word) => word.match(/[a-z]/gmi));
      const currentYear = String(new Date().getFullYear());
      if (title.includes(currentYear)) {
        trimmed.push(currentYear);
      }
      const slug = trimmed.join("-");
      return slug;
    } catch (error) {
      console.log(`Error genrating slug: ${error}`);
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
  extractVertical: (text) => {
    const regex = /vertical:/gmi;
    try{
      const m = text.match(regex);
      const t = text.replace(regex, "").replace(/\r?\n|\r/g, " ").trim();
      if(m) return t;
      else return null;
    }catch(e){
      return null;
    }
  },
  extractSubvertical: (text) => {
    const regex = /subvertical:/gmi;
    try{
      const m = text.match(regex);
      const t = text.replace(regex, "").replace(/\r?\n|\r/g, " ").trim();
      if(m) return t;
      else return null;
    }catch(e){
      return null;
    }
  },
  extractReadTime: (text) => {
    const regex = /read\s+time:/gmi;
    try{
      const m = text.match(regex);
      const t = text.replace(regex, "").replace(/\r?\n|\r/g, " ").trim();
      if(m) return t;
      else return null;
    }catch(e){
      return null;
    }
  },
  extractArticleType: (text) => {
    const regex = /article\s+type:/gmi;
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
  transformDomainToHygraphAPIRef: (domain) => {
    switch(domain){
      case "findhomepros.com":
        return "findhomeprosCom";
      case "protect.com":
        return "protectCom";
      case "free-insurance-quotes.us":
        return "freeInsuranceQuotesUs";
      default:
        return null;
    }; 
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
  /*
  * @description - locates the id of the image upload result - needed because we switch between legacy and new formats in hygraph
  * @param {array} uploadResults - array of objects containing the results of the image uploads
  * @param {number} index - the index of the uploadResults array to locate the id for
  */
  locateUploadResultId: function (obj) {
    // Base case: if obj is not an object or is null, return null
  if (typeof obj !== 'object' || obj === null) {
    return null;
  }

  // Check if the current object has an 'id' property
  if (obj.hasOwnProperty('id')) {
    return obj.id;
  }

  // If not, iterate over the object's keys
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const result = this.locateUploadResultId(obj[key]); // Recursively search in the nested object
      if (result !== null) {
        return result; // Return the found id if it exists
      }
    }
  }

  return null; // Return null if no id is found
  },
};

export { utils };
