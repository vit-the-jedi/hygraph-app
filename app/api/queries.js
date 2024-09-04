"use strict";
import { article } from "./send-article.js";
const API_KEY =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE3MjQwODU1MTEsImF1ZCI6WyJodHRwczovL2FwaS11cy1lYXN0LTEtc2hhcmVkLXVzZWExLTAyLmh5Z3JhcGguY29tL3YyL2Nsd3p5ZnNkbDAya2cwN3c4dm9icDMyancvbWFzdGVyIiwibWFuYWdlbWVudC1uZXh0LmdyYXBoY21zLmNvbSJdLCJpc3MiOiJodHRwczovL21hbmFnZW1lbnQtdXMtZWFzdC0xLXNoYXJlZC11c2VhMS0wMi5oeWdyYXBoLmNvbS8iLCJzdWIiOiJmNTI1MTk5OS0yNjFmLTQ0MDQtODcwMy0xZWMxMTVmOWI5YzUiLCJqdGkiOiJjbTAxN3p5ZTUwd2s2MDdrM2cxMmcxNXBuIn0.souiHUzlR8glcjEQNucTo2wcNP3Dvpeo22RmkxHp3YpTQtU2F52pXqAA3aRjHXVYpZPRaXrmfFVpSlV78mTHh8yo99SBwcBwbuCnlUxZJ1O5OGNTaWFeiaU8D_0cTBLW6D8XMqGvrhNsrZrbFY-D-Kk-78vij-liYyBMSXfi4FjQmeUaipZrCzaEKpZuB-CDWj3MjSVes45DGiLL79up2HjcssZeVD4H-M3g3AWYR5qTb45urmQQ3V9vgv5nM0f1hqfsczQmYyZu1-TRSC4VfdjqAPfCnnwa_LgSpkDVZHxBRz4yMYoRBVs6bv-wxb4x_UvSHHO751i1vtQGSYRkn8D9PloAOPtDoJSz6AdnJCk5OUuyPTcrvyKcG35Cu9kwh6wjtRSgNPAkR-8O_NjzqLW16BWgXkCPH1vppSJorRy_Z8lnrRlx8N1DvGVzvj7UGKMvRfaw2SN58jQprAU28TZuB8Ll22P3Clie46mQf8mroEqto5VtQpN0JL17aBTtm08119Tng_PGP6Ddw_afI7dni2p8kCLmhZkkn4_d_7SDl2LAAezVQD4U0EIjZcnUY1ibxJBR7EVoo6SdJz7er34R3jMXgpROtbBdyvTUkxDt-nstYGkGs0LuHnciskM06QjEaP3E0cMLHvD-KEB5wSFvrSaeERVXpT5MKQXqLKI";
const API_URL =
  "https://api-us-east-1-shared-usea1-02.hygraph.com/v2/clwzyfsdl02kg07w8vobp32jw/master";

const queries = {
  uploadImage: async function (uri){
  return new Promise(async(resolve, reject)=>{
    try{
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          query: `mutation uploadArticleImage{
                createAsset(
                  data: {
                    uploadUrl:"${uri}"
                  }
                ) {
                  id
                }
              }`,
        }),
      });
      const respJSON = await response.json();
      resolve(respJSON);  
    }catch(err){  
      reject(err);
    }
  });
  },
  sendArticle: async function(article){
    const query = `mutation createArticle($article: ArticleCreateInput!){
                    createArticle(data: $article)
                      {
                        id
                      }
                    }`;
    return new Promise(async(resolve, reject)=>{
      try{
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({ 
            query: query,
            variables: {
              article: article,
            }
           }),
        });
        const respJSON = await response.json();
        resolve(respJSON);  
      }catch(err){  
        reject(err);
      }
    });
  }, 
}

export {queries};