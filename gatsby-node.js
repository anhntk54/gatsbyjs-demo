/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

const path = require("path");
/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions
  const articlePost = path.resolve("./src/templates/data-content-post.js")
  createPage({
    path: "/using-dsg",
    component: require.resolve("./src/templates/using-dsg.js"),
    context: {},
    defer: true,
  })
  const result = await graphql(
    `
      {
        allStrapiDataContentTest {
          nodes {
            slug,id,
            name
          }
        }
      }
    `
  )
  // console.log(result)
  const dataContentList = result.data.allStrapiDataContentTest.nodes;
  if (dataContentList.length > 0) {
    dataContentList.forEach((article) => {
      createPage({
        path: `/article/${article.slug}`,
        component: articlePost,
        context: {
          slug: article.slug,
        },
      })
    })
  }
}
