// Step 1: Import React
import * as React from 'react'
import Layout from "../components/layout";

// Step 2: Define your component
const AboutPage = () => {
    return (
        <Layout pageTitle="About">
            <h1>About Me</h1>
            <p>Hi there! I'm the proud creator of this site, which I built with Gatsby.</p>
        </Layout>
    )
}

// Step 3: Export your component
export default AboutPage
