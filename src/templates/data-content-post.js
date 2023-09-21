import React from "react"
import { graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Layout from "../components/layout"
import Seo from "../components/seo"

const ArticlePage = ({ data }) => {
  const article = data.strapiDataContentTest
    console.log(data)

  const seo = {
    metaTitle: article.title,
    metaDescription: article.description,
    shareImage: article.cover,
  }

  return (
    <Layout as="article">
      <Seo seo={seo} />
      <header className="container max-w-4xl py-8">
        <h1 className="text-6xl font-bold text-neutral-700">{article.name}</h1>
          <GatsbyImage
          image={getImage(article?.image?.localFile)}
          className="mt-6"
        />
      </header>
    </Layout>
  )
}

export const pageQuery = graphql`
  query ($slug: String) {
    strapiDataContentTest(slug: { eq: $slug }) {
      id
      slug, name,
      image {
        localFile {
          url
          childImageSharp {
            gatsbyImageData
          }
        }
      }
    }
  }
`

export default ArticlePage
