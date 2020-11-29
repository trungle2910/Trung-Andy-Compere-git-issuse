## Project Structure

How to structure large React apps into folders and files is a highly opinionated topic. There is no right way to do it. However, let set up conventions to structure this React app:

- Put your stateless components in `/src/components/`, because we plan to **"reuse"** these components.
- Keep all the logics, API calls in `App.js`. Seperating UI and the logic will help you debug 10x faster.

In the end, you will have a project structure like this:

```
  |- src\
    |- components\
      |- IssueList.js
      |- IssueModal.js
      |- PaginationBar.js
      |- PublicNavbar.js
      |- SearchForm.js
    |- App.css
    |- App.js
    |-index.js
    ...
  ```

To focus on the main concepts (ReactJS, Redux, ExpressJS, etc.), we will use pre-defined CSS classes of Bootstrap and `react-bootstrap`, and put the customized CSS styles in `App.css`. However, feel free to read more about the other ways to organize your CSS styles, e.g.:

- **[CSS Module in create-react-app](https://create-react-app.dev/docs/adding-a-css-modules-stylesheet)**: After you have setup your application with create-react-app (e.g. npx create-react-app my-app), you don't need to install anything else to make CSS modules work. However, you have to give your CSS files the "module" prefix prior the extension:

  ```css
  /* In src/components/List/List.module.css */
  .avatar {
    width: 128px;
    height: 128px;
  }

  .text-grey {
    color: #657786;
  }
  ```

  ```javascript
  // In src/components/List/index.js
  import React from "react";
  import styles from "./List.module.css";

  const List = () => {
    // ...
    return (
      // Then you can use css in your JSX like this
      <span className={styles["text-grey"]}>...</span>

      // If you want to concatenate with other classes
      <span className={`${styles["text-grey"]} mr-2`}>...</span>
      // ...
    })
  }

  export default List;
  ```

  In case of the `avatar` style, you can retrieve it with `styles.avatar` too. However, for the other styles with dashes you need to retrieve them with strings from the object, e.g. `styles["text-grey"]`. 


  Good job! [Back to instructions](../README.md)