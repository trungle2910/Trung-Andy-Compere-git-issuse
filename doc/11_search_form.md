## The search form

**Requirements**: 

* User can input `{owner}/{repo}` in the input box and hit `Enter` to submit.  

**States and event handlers**:

- For the search form we need:
  - `searchInput`: to store the value in the input box
  - `owner` and `repo`: to store owner and repo (extracted from `searchInput`)
  - `handleSearchInputChange()`: a function to handle change in the search input box
  - `handleSearchFormSubmit()`: a function to handle submit event of the search form
  - `loading`: when the app load data from Github, `loading` should be true and lock the submit button to avoid multiple click.

### Build the stateless component

* Create `src/components/SearchForm.js`:

```javascript
import React from "react";
import { Form, Button, Col } from "react-bootstrap";

const SearchForm = ({
  searchInput,
  handleInputChange,
  handleSubmit,
  loading,
}) => {
  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <Form.Row>
        <Col>
          <Form.Control
            id="search-input"
            type="text"
            placeholder="Search.."
            value={searchInput}
            onChange={handleInputChange}
          />
        </Col>
        {loading ? (
          <Button variant="primary" type="button" disabled>
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            Searching...
          </Button>
        ) : (
          <Button type="submit" disabled={!searchInput}>
            Search
          </Button>
        )}
      </Form.Row>
    </Form>
  );
};

export default SearchForm;
```

* In `App.js`, add:

```javascript
    //...
      <h1>Github Issues</h1>
      <Search />
    //...
```

* You should see the search form on the home page. In the next step we will pass **props** from `App` to `SearchForm` to **controll** the component.

### Adding states and event handlers


 
- In `src/App.js`:

  ```javascript
  // ...
  const App = () => {
    const [searchInput, setSearchInput] = useState("");
    const [owner, setOwner] = useState("");
    const [repo, setRepo] = useState("");
    const [loading, setLoading] = useState(false);

    function getOwnerAndRepo() {
      const repo = searchInput.substring(searchInput.lastIndexOf("/") + 1);
      const withoutRepo = searchInput.substring(0, searchInput.lastIndexOf("/"));
      const owner = withoutRepo.substring(withoutRepo.lastIndexOf("/") + 1);
      return { repo, owner };
    }

    const handleSearchInputChange = (event) => {
      setSearchInput(event.target.value);
    };

    const handleSearchFormSubmit = (event) => {
      event.preventDefault();
      const { owner, repo } = getOwnerAndRepo();
      setOwner(owner);
      setRepo(repo);
    };

    return (
      <div className="text-center">
      <PublicNavbar />
      <Container>
        <h1>Github Issues</h1>
        <SearchForm
          searchInput={searchInput}
          handleInputChange={handleSearchInputChange}
          handleSubmit={handleSearchFormSubmit}
          loading={loading}
        />
        {/* Showing the owner and repo is for testing only */}
        <h4>Owner: {owner}</h4>
        <h4>Repo: {repo}</h4>
      </Container>
    </div>
    );
  };
  export default App;
  ```

- That is how you can "control" a form in React with React's `useState()` hook. Type in the `owner` and `repo` seperated by `/`, e.g. `facebook/react`, hit `Enter` and you should see them right below.

- Remove the `<h4>` tags after you are done testing.


Good job! [Back to instructions](../README.md)