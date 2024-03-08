// Step 1: Import React
import * as React from 'react'
import {Link} from "gatsby";
import Layout from "../components/layout";
import {useEffect} from "react";
const axios = require('axios');
// Step 2: Define your component
const IndexPage = () => {
    const ge =  async () => {
        console.log('ge')
            const data = await axios.get('https://1ebd-14-191-183-97.ngrok-free.app');
            console.log(data);
        }
    useEffect(() => {
        console.log('useEffect')

        ge();
    }, [])
    return (
        <Layout pageTitle="Home Page">
            <h1>Welcome to my Ga;lâlatsby site!</h1>
            <button onClick={ge}>click</button>
            <Link to="/about">About</Link>
            <p>I'm making this by following the Gatsby Tutorial.</p>
        </Layout>
    )
}

// You'll learn about this in the next task, just copy it for now
export const Head = () => <title>Home Pag2e</title>

// Step 3: Export your component
export default IndexPage
