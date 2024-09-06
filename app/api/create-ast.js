"use strict";

import { parse } from "node-html-parser";

const transpileSheetAstToHygraphAst = (contentHTMLStr) => {

const root = parse(contentHTMLStr);
  const children = root.getElementsByTagName("*").map((child) => {

    switch (child.tagName.toLowerCase()) {
      case "h1":
        return {
          type: "heading-one",
          children: [
            {
              text: child.text,
            },
          ],
        };
      case "h2":
        return {
          type: "heading-two",
          children: [
            {
              text: child.text,
            },
          ],
        };
      case "h3":
        return {
          type: "heading-three",
          children: [
            {
              text: child.text,
            },
          ],
        };
      case "h4":
        return {
          type: "heading-four",
          children: [
            {
              text: child.text,
            },
          ],
        };
      case "h5":
        return {
          type: "heading-five",
          children: [
            {
              text: child.text,
            },
          ],
        };
      case "h6":
        return {
          type: "heading-six",
          children: [
            {
              text: child.text,
            },
          ],
        };
      case "p":
        return {
          type: "paragraph",
          children: [
            {
              text: child.text,
            },
          ],
        };
      case "a":
        return {
          type: "link",
          href: child.rawAttributes.href,
          title: "",
          openInNewTab: true,
          children: [
            {
              type: "text",
              text: child.text,
            },
          ],
        };
    }
  });
  return children;
};

const hygraphAst = {
  title: null,
  metaKeywords: null,
  ast: [],
  excerpt: null,
}

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
}
const ast = [];
const createAstFromDocs = (content) => {
  content.forEach((element) => {
    const elementContent = element?.paragraph;
    const innerElements = elementContent?.elements;
    if(!elementContent || !innerElements ) return null;
    //check length of elements
    innerElements.forEach((innerEl, index, arr) => {
      const elementContentText = elementContent?.elements[index]?.textRun?.content.replace(/(\r\n|\n|\r)/gm,"");
      const isLinkElement = elementContent?.elements[index]?.textRun?.textStyle?.link;
      //check if textRun.textStyle.link
      //if yes grab the link.url for the href
      //pass a different obj that denotes a link instead of text
      if(elementContent.elements.length > 0 && elementContentText?.length > 0 && !innerEl.inlineObjectElement) {
       
       if(!isLinkElement) {
        ast.push({
          type: elementContent.paragraphStyle?.namedStyleType ? createHeadingName(elementContent.paragraphStyle.namedStyleType) : "paragraph",
          children: [
            {
              bold: elementContent.elements[index]?.textRun?.textStyle?.bold,
              italic: elementContent.elements[index]?.textRun?.textStyle?.italic,
              text: elementContentText
            },
          ],
        });
       }else {
        ast.push({
          type: "link",
          href: isLinkElement.url,
          children: [
            {
              bold: elementContent.elements[index]?.textRun?.textStyle?.bold,
              italic: elementContent.elements[index]?.textRun?.textStyle?.italic,
              text: elementContentText
            },
          ],
        });
       }
      }
    });
  });
  return {
    children: ast
  };
};
const transpileDocsAstToHygraphAst = (contentObj) => {
  //expect first element in Docs AST with a paragraph object to be the title
  //check to make sure there is, in fact, text content inside of it
  //track index of first element with text content
  let i;
  for (i = 0; i < contentObj.length; i++) {
    if (contentObj[i].paragraph && contentObj[i].paragraph.elements[0].textRun.content !== "") {
      hygraphAst.title = contentObj[i].paragraph.elements[0].textRun.content.replace(/(\r\n|\n|\r)/gm,"");
      break;
    }
  }
  //expect second element in Docs AST with a paragraph object to be the metadata
  //check to make sure there is, in fact, text content inside of it
  i++;
  if (contentObj[i].paragraph && contentObj[i].paragraph.elements[0].textRun.content !== "" && contentObj[i].paragraph.elements[0].textRun.content.includes("<meta")) {
    hygraphAst.metaKeywords = contentObj[i].paragraph.elements[0].textRun.content.replace(/(\r\n|\n|\r)/gm,"");
  }
  i++;
  //expect next to be excerpt
  if (contentObj[i].paragraph && contentObj[i].paragraph.elements[0].textRun.content !== "") {
    hygraphAst.excerpt = contentObj[i].paragraph.elements[0].textRun.content.replace(/(\r\n|\n|\r)/gm,"").replace("Excerpt: ","");
  }
  i++;
  const remainingObjects = contentObj.slice(i);
  hygraphAst.ast = createAstFromDocs(remainingObjects);
  return hygraphAst;
};
export { transpileSheetAstToHygraphAst, transpileDocsAstToHygraphAst, hygraphAst };

