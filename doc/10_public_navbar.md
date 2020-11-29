## The public Navbar

* Put the logo of your app in `src/images/logo.svg`. A `svg` file is not required, you can use `png` or `jpg` as well. 

* Put the [Github Mark](https://github.com/logos) as `github_icon.png` in `src/images/`.

* Create `src/components/PublicNavbar.js`:

```javascript
import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import logo from "images/logo.svg";
import githubIco from "images/github_icon.png";

const PublicNavbar = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand className="mr-auto">
        <img src={logo} alt="CoderSchool" width="200px" />
      </Navbar.Brand>
      <Nav className="mr-auto"></Nav>
      <Nav>
        <a
          href="https://github.com/coderschool/ftw_w5_github_issues"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={githubIco} alt="Github" width="32px" />
        </a>
      </Nav>
    </Navbar>
  );
};

export default PublicNavbar;
```

* In `App.js`, add:

```javascript
    //...
    <div className="text-center">
      <PublicNavbar />
      <Container>
        <h1>Github Issues</h1>
    //...
```


Good job! [Back to instructions](../README.md)