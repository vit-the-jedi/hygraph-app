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
  let contentBlockStyle = null;
  //ast is an array of objects, each object represents a text block
  let ast = content.map((contentBlock, index, arr) => {
    //create an inner array of objects that will be the children of the parent text block
    //each child represents a text node with its style
    //when added to the children property on the parent text block, each text node will be combined to display an entire text block,
    //instead of each text node being displayed as a separate block
    if (!contentBlock.paragraph) {
      return null;
    }
    const totalTextRunArr = contentBlock?.paragraph?.elements.map((element, i, arr) => {
      if (element.textRun && element.textRun.content) {
        contentBlockStyle = contentBlock.paragraph?.paragraphStyle?.namedStyleType
          ? createHeadingName(contentBlock.paragraph.paragraphStyle.namedStyleType)
          : "paragraph";
        return {
          bold: element.textRun?.textStyle?.bold,
          italic: element.textRun?.textStyle?.italic,
          underline: element.textRun?.textStyle?.underline,
          text: element.textRun?.content.replace(/(\r\n|\n|\r)/gm, ""),
        };
      }
    });
    return {
      type: contentBlockStyle,
      //filter out any null values
      children: totalTextRunArr.filter((element) => element),
    };
  });
  return {
    children: ast.filter((astNode) => astNode),
  };
};

const transpileDocsAstToHygraphAst = (contentObj) => {
  const hygraphAst = new HygraphAst();
  //return an array with the remaining content after extracting the title, metaKeywords, excerpt, vertical, subvertical, articleType, and readTime
  const remainingContent = contentObj.map((element, outerIndex, arr) => {
    if (element.paragraph && element.paragraph.elements) {
      for (const el of element.paragraph.elements) {
        const text = el?.textRun?.content;
        if (text) {
          if (!hygraphAst.title) {
            const titleMatch = utils.extractTitle(text);
            if (titleMatch) {
              hygraphAst.title = titleMatch;
              element = null;
            }
          }
          if (!hygraphAst.metaKeywords) {
            const metaKeywordMatch = utils.extractMetaKeywords(text);
            if (metaKeywordMatch) {
              hygraphAst.metaKeywords = metaKeywordMatch;
              element = null;
            }
          }
          if (!hygraphAst.excerpt) {
            const excerptMatch = utils.extractExcerpt(text);
            if (excerptMatch) {
              hygraphAst.excerpt = excerptMatch;
              element = null;
            }
          }
          if (!hygraphAst.vertical) {
            const verticalMatch = utils.extractVertical(text);
            if (verticalMatch) {
              hygraphAst.vertical = verticalMatch;
              element = null;
            }
          }
          if (!hygraphAst.subvertical) {
            const subVerticalMatch = utils.extractSubvertical(text);
            if (subVerticalMatch) {
              hygraphAst.subvertical = subVerticalMatch;
              element = null;
            }
          }
          if (!hygraphAst.articleType) {
            const articleTypeMatch = utils.extractArticleType(text);
            if (articleTypeMatch) {
              hygraphAst.articleType = articleTypeMatch;
              element = null;
            }
          }
          if (!hygraphAst.readTime) {
            const readTimeMatch = utils.extractReadTime(text);
            if (readTimeMatch) {
              hygraphAst.readTime = readTimeMatch;
              element = null;
            }
          }
        }
      }
    }
    return element;
  });
  //filter out the empty or undefined array entries and create the ast wwith the rest
  hygraphAst.ast = createAstFromDocs(
    remainingContent.filter((content) => content)
  );
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

export { transpileDocsAstToHygraphAst, HygraphAst };
