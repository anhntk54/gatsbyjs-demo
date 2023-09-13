import * as React from 'react'
import { Link } from 'gatsby'
import {ReactNode} from "react";
interface MyComponentProps {
  children: ReactNode;
    pageTitle: string
}
const Layout = ({ pageTitle, children }: MyComponentProps) => {
  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
      </nav>
      <main>
        <h1>{pageTitle}</h1>
        {children}
      </main>
    </div>
  )
}

export default Layout
