"use strict";

import { utils } from "./utils.js";
// import { parse } from "node-html-parser";

// const transpileSheetAstToHygraphAst = (contentHTMLStr) => {

// const root = parse(contentHTMLStr);
//   const children = root.getElementsByTagName("*").map((child) => {

//     switch (child.tagName.toLowerCase()) {
//       case "h1":
//         return {
//           type: "heading-one",
//           children: [
//             {
//               text: child.text,
//             },
//           ],
//         };
//       case "h2":
//         return {
//           type: "heading-two",
//           children: [
//             {
//               text: child.text,
//             },
//           ],
//         };
//       case "h3":
//         return {
//           type: "heading-three",
//           children: [
//             {
//               text: child.text,
//             },
//           ],
//         };
//       case "h4":
//         return {
//           type: "heading-four",
//           children: [
//             {
//               text: child.text,
//             },
//           ],
//         };
//       case "h5":
//         return {
//           type: "heading-five",
//           children: [
//             {
//               text: child.text,
//             },
//           ],
//         };
//       case "h6":
//         return {
//           type: "heading-six",
//           children: [
//             {
//               text: child.text,
//             },
//           ],
//         };
//       case "p":
//         return {
//           type: "paragraph",
//           children: [
//             {
//               text: child.text,
//             },
//           ],
//         };
//       case "a":
//         return {
//           type: "link",
//           href: child.rawAttributes.href,
//           title: "",
//           openInNewTab: true,
//           children: [
//             {
//               type: "text",
//               text: child.text,
//             },
//           ],
//         };
//     }
//   });
//   return children;
// };

const createHeadingName = (namedStyleType) => {
  switch (namedStyleType) {
    case "HEADING_1":
      return "heading-one";
    case "HEADING_2":
      return "heading-two";
    case "HEADING_3":
      return "heading-three";
    case "HEADING_4":
      return "heading-four";
    case "HEADING_5":
      return "heading-five";
    case "HEADING_6":
      return "heading-six";
    default:
      return "paragraph";
  }
};
const createAstFromDocs = (content) => {
  const ast = [];
  content.forEach((element, index, arr) => {
    const elementContentText = element?.textRun?.content.replace(
      /(\r\n|\n|\r)/gm,
      ""
    );
    const isLinkElement = element?.textRun?.textStyle?.link;
    const isPeriod = !/[a-z]/i.test(elementContentText) && elementContentText.includes(".");
    if (elementContentText?.length > 0 && !element.inlineObjectElement) {
      let returnObj;
      if (!isLinkElement && !isPeriod) {
        returnObj = {
          type: element.paragraphStyle?.namedStyleType
            ? createHeadingName(element.paragraphStyle.namedStyleType)
            : "paragraph",
          children: [
            {
              bold: element?.textRun?.textStyle?.bold,
              italic: element?.textRun?.textStyle?.italic,
              text: elementContentText,
            },
          ],
        };
      // Directly push the object into `ast` array
      ast.push(returnObj);
      } else {
        const prevEl = ast[ast.length - 1];
        const prevElChildren = prevEl?.children;
        if(isLinkElement){
          const linkReturnObj = {
            type: "link",
            href: isLinkElement.url,
            children: [
              {
                bold: element?.textRun?.textStyle?.bold,
                italic: element?.textRun?.textStyle?.italic,
                text: elementContentText,
              },
            ],
          }
          prevElChildren.push(linkReturnObj);
        }else if(isPeriod){
          prevElChildren[prevElChildren.length - 1].children[0].text += ".";
        }
      }
    }
  });

  return {
    children: ast.filter((el) => el !== undefined),
  };
};

const transpileDocsAstToHygraphAst = (contentObj) => {
  const hygraphAst = new HygraphAst();
  const remainingObjects = [];
  contentObj.forEach((element, outerIndex, arr) => {
    if (element.paragraph && element.paragraph.elements) {
      element.paragraph.elements.forEach((innerElement) => {
        const text = innerElement?.textRun?.content;
        if (text) {
          if (!hygraphAst.title) {
            const titleMatch = utils.extractTitle(text);
            if (titleMatch) {
              hygraphAst.title = titleMatch;
            }
          }
          if (!hygraphAst.metaKeywords) {
            const metaKeywordMatch = utils.extractMetaKeywords(text);
            if (metaKeywordMatch) {
              hygraphAst.metaKeywords = metaKeywordMatch;
            }
          }
          if (!hygraphAst.excerpt) {
            const excerptMatch = utils.extractExcerpt(text);
            if (excerptMatch) {
              hygraphAst.excerpt = excerptMatch;
            }
          }
          if (!hygraphAst.vertical) {
            const verticalMatch = utils.extractVertical(text);
            if (verticalMatch) {
              hygraphAst.vertical = verticalMatch;
            }
          } 
          if (!hygraphAst.subvertical) {
            const subVerticalMatch = utils.extractSubvertical(text);
            if (subVerticalMatch) {
              hygraphAst.subvertical = subVerticalMatch;
            }
          }if (!hygraphAst.articleType) {
            const articleTypeMatch = utils.extractArticleType(text);
            if (articleTypeMatch) {
              hygraphAst.articleType = articleTypeMatch;
            }
          }
          if (!hygraphAst.readTime) {
            const readTimeMatch = utils.extractReadTime(text);
            if (readTimeMatch) {
              hygraphAst.readTime = readTimeMatch;
            }
          }
          else {
            innerElement.paragraphStyle = element.paragraph.paragraphStyle;
            remainingObjects.push(innerElement);
          }
        }
      });
    }
  });
  hygraphAst.ast = createAstFromDocs(remainingObjects);
  return hygraphAst;
};

class HygraphAst {
  constructor() {
    this.title = null;
    this.metaKeywords = null;
    this.ast = [];
    this.excerpt = null;
    this.vertical = null;
    this.subvertical = null;
    this.articleType = null;
    this.readTime = null;
  }
}

export { transpileDocsAstToHygraphAst, HygraphAst};
