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
const extractTextAndPropsFromElement = (contentBlock, isTable = false) => {
  let contentBlockTextStyle = null;
  const totalTextRunArr = contentBlock?.paragraph?.elements.map(
    (element, i, arr) => {
      const isLinkElement = element?.textRun?.textStyle?.link;
      if (isLinkElement) {
        return {
          type: "link",
          href: isLinkElement.url,
          title: "",
          openInNewTab: true,
          children: [
            {
              type: "text",
              text: element.textRun?.content.replace(/(\r\n|\n|\r)/gm, ""),
            },
          ],
        };
      }
      if (element.textRun && element.textRun.content) {
        contentBlockTextStyle = contentBlock.paragraph?.paragraphStyle
          ?.namedStyleType
          ? createHeadingName(
              contentBlock.paragraph.paragraphStyle.namedStyleType
            )
          : "paragraph";
        //if(isTable) debugger;
        if (element.textRun.content === "") {
          return null;
        }
        return {
          bold: element.textRun?.textStyle?.bold,
          italic: element.textRun?.textStyle?.italic,
          underline: element.textRun?.textStyle?.underline,
          text: element.textRun?.content.replace(/(\r\n|\n|\r)/gm, ""),
        };
      }
    }
  );
  return {
    type: contentBlockTextStyle,
    //filter out any null values
    children: totalTextRunArr.filter((element) => element),
  };
};
const createAstFromDocs = (content) => {
  //ast is an array of objects, each object represents a text block
  let ast = content.map((contentBlock, index, arr) => {
    //create an inner array of objects that will be the children of the parent text block
    //each child represents a text node with its style
    //when added to the children property on the parent text block, each text node will be combined to display an entire text block,
    //instead of each text node being displayed as a separate block
    if (contentBlock.paragraph) {
      return extractTextAndPropsFromElement(contentBlock);
    } else if (contentBlock.table) {
      const totalTableRows = contentBlock.table.tableRows.map(
        (tableRow, i, arr) => {
          const totalTableCells = tableRow.tableCells.map(
            (tableCell, i, arr) => {
              const totalTableCellChildren = tableCell.content.map(
                (contentBlock, i, arr) => {
                  let textAndPropsArr =[]
                  const textAndProps = extractTextAndPropsFromElement(contentBlock, true);
                  if(textAndProps.children[0].text !== "") return textAndProps;
                  return null
                }
              );
              return {
                type: "table_cell",
                children: totalTableCellChildren,
              };
            }
          ).filter((el)=> el &&  el.children[0] && el.children[0].children[0].text !== "");
          return {
            type: "table_row",
            children: totalTableCells,
          };
        }
      );
      return {
        type: "table",
        children: [{ type: "table_body", children: totalTableRows }],
      };
    }
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
          if (!hygraphAst.contentTag) {
            const contentTagMatch = utils.extractContentTags(text);
            if (contentTagMatch) {
              hygraphAst.contentTag = contentTagMatch;
              element = null;
            }
          }
          if (!hygraphAst.coverImageAltText) {
            const contentTagMatch = utils.extractCoverImageAltText(text);
            if (contentTagMatch) {
              hygraphAst.coverImageAltText = contentTagMatch;
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
  console.log(`HYGRAPH AST`, hygraphAst);
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
    this.contentTag = null;
  }
}

export { transpileDocsAstToHygraphAst, HygraphAst };
