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
  extractMetaKeywords: (metaKeywords) => {
    try{
      const keywords = metaKeywords.match(/content="(.*?)"/);
      return keywords[1];
    }catch(e){
      console.log(`No keywords found in document, proceeding...`)
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
