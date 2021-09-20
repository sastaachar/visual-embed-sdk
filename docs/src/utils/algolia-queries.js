const config = require('../configs/doc-configs');
const { htmlToText } = require('html-to-text');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const gatsbyIndex = `Pages`
const typedocIndex = `typedoc`

const getPathPrefix = () => {
  return 'docs';
};

const getPath = (path) =>
    getPathPrefix() ? `${path}/${getPathPrefix()}` : path;

const stripLinks = (text) => {
  if (text) {
      const re = /<a\s.*?href=[\"\'](.*?)[\"\']*?>(.*?)<\/a>/g;
      const str = text;
      const subst = '$2';
      const result = str.replace(re, subst);
      return result;
  }
  return '';
};

const getTextFromHtml = (html) =>
  htmlToText(stripLinks(html)).replace(/\r?\n|\r/g, ' ');

const pageQuery = `
query {
  allAsciidoc(sort: { fields: [document___title], order: ASC }) {
      edges {
          node {
              id
              document {
                title
              }
              pageAttributes {
                  pageid
                  title
                  description
              }
              html       
          }
      }
  }
  allFile(filter: {sourceInstanceName: {eq: "htmlFiles"}}) {
    edges {
        node {
            id
            extension
            dir
            name
            relativePath
            childHtmlRehype {
              html
              htmlAst
            }
        }
    }
  }
}
`

const queries = [
  {
    query: pageQuery,
    transformer: ({ data }) => {
      return [
        ...data.allAsciidoc.edges
            .filter(
                (edge) =>
                    edge.node.pageAttributes.pageid &&
                    edge.node.pageAttributes.pageid !== 'nav',
            )
            .reduce((acc,edge) => {
                const pageid = edge.node.pageAttributes.pageid;
                const newDiv = new JSDOM(`<div>${edge.node.html}</div>`).window.document;
                const preambleEle = newDiv.querySelector('#preamble');
                const preamble = {
                    objectID: edge.node.id + 'preamble',
                    sectionId: '',
                    sectionTitle: edge.node.document.title,
                    body: preambleEle && getTextFromHtml(preambleEle.innerHTML),
                    pageid,
                    type: 'ASCII',
                    title: edge.node.document.title,
                };
                const sections = Array.prototype.map.call(newDiv.querySelectorAll('.sect1'),(sect)=> {
                  const sectId = sect.querySelector('h2').id;
                  const sectTitle = sect.querySelector('h2').innerHTML;
                  return {
                    objectID: edge.node.id + sectId,
                    sectionId: sectId,
                    sectionTitle: sectTitle,
                    body: sect && getTextFromHtml(sect.innerHTML),
                    pageid,
                    type: 'ASCII',
                    title: edge.node.document.title,
                  };
                });
                return [...acc,...sections, preamble];
            },[]),
        ...data.allFile.edges
            .filter((edge) => edge.node.extension === 'html')
            .map((edge) => {
                const pageid = edge.node.name;
                const body =
                    edge &&
                    edge.node &&
                    edge.node.childHtmlRehype
                        ? getTextFromHtml(
                              edge.node.childHtmlRehype.html,
                          )
                        : '';
                return {
                    objectID: edge.node.id,
                    body,
                    pageid,
                    typedoc: true,
                    type: edge.node.extension,
                    title: edge.node.childHtmlRehype.htmlAst.children.find(
                        (children) =>
                            children.tagName === 'title',
                    ).children[0].value,
                    link: `${getPath(config.DOC_REPO_NAME)}/${
                        config.TYPE_DOC_PREFIX
                    }/${edge.node.relativePath}`,
                };
            }),
      ];
    },
    indexName: gatsbyIndex,
    settings: { attributesToSnippet: ['body:15',
    'title'],
    highlightPreTag: '<em style="color:blue;">',
    highlightPostTag: '</em>'
  },
  },
]

module.exports = queries