## Showing issue detail in a modal

**Requirements**:

- User can click on an issue in the list, then a modal pops up and shows the detail of the issue
- The app should start fetching the first five comments of the issue
- A loading spinner should be showed during the fetching process
- If there are more than five comments, a button `Show more` should be seen at the bottom of the list of comments
- When user click on `Show more`, the app should load the next five comments from the Github API

**Implementation**:

- We define some states for this feature:
  - `showModal`: a state to show or hide the modal
  - `selectedIssue`: a state to store the detail info of the selected issue
  - `loadingComments`: a state to show/hide the loading spinner when the app loads comments
  - `urlFetchComments`: a state that stores the url to load more comments.
  - `commentPageNum` and `commentTotalPageNum`: similiar to the pagination feature, we use these two states to control the `Show more` comments feature
  
- We need two function to handle two events:
  - `showDetail()`: this function will handle the event when user click on an issue
  - `handleMoreComments()`: this function will be triggered when user click on `Show more` button

- For the side-effect to load comments, we use another `useEffect` hook. This `useEffect` depends on `urlFetchComments`. When user click on an issue, the app will initialize `urlFetchComments` with the issue number and `commentPageNum = 1`. When user click on `Show more`, the app will increase `commentPageNum` by 1 and modify `urlFetchComments` to trigger the side-effect.

### Let's start coding

- In `src/App.js`:

```javascript
  // ...
  const [commentPageNum, setCommentPageNum] = useState(1);
  const [commentTotalPageNum, setCommentTotalPageNum] = useState(1);
  const [urlFetchComments, setUrlFetchComments] = useState("");
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [loadingComments, setLoadingComments] = useState(false);

  // ...
  const showDetail = (item) => {
    setShowModal(true);
    if (selectedIssue?.number !== item.number) {
      setComments([]);
      setCommentPageNum(1);
      setCommentTotalPageNum(1);
      setSelectedIssue(item);
      setUrlFetchComments(
        `https://api.github.com/repos/${owner}/${repo}/issues/${item.number}/comments?page=1&per_page=5`
      );
    }
  };

  const handleMoreComments = () => {
    if (commentPageNum >= commentTotalPageNum) return;
    const url = `https://api.github.com/repos/${owner}/${repo}/issues/${
      selectedIssue.number
    }/comments?page=${commentPageNum + 1}&per_page=5`;
    setCommentPageNum((num) => num + 1);
    setUrlFetchComments(url);
  };

  useEffect(() => {
    const fetchComments = async () => {
      if (!urlFetchComments && !showModal) return;
      setLoadingComments(true);
      try {
        const response = await fetch(urlFetchComments);
        const data = await response.json();
        if (response.status === 200) {
          const link = response.headers.get("link");
          if (link) {
            const getTotalPage = link.match(
              /page=(\d+)&per_page=\d+>; rel="last"/
            );
            if (getTotalPage) {
              setCommentTotalPageNum(parseInt(getTotalPage[1]));
            }
          }
          setComments((c) => [...c, ...data]);
          setErrorMsg(null);
        } else {
          setErrorMsg(`FETCH COMMENTS ERROR: ${data.message}`);
          setShowModal(false);
        }
      } catch (error) {
        setErrorMsg(`FETCH COMMENTS ERROR: ${error.message}`);
        setShowModal(false);
      }
      setLoadingComments(false);
    };
    fetchComments();
  }, [urlFetchComments, showModal]);

  // ...

  return (
    <div className="App">
        ...
        <IssueModal
          issue={selectedIssue}
          comments={comments}
          loadingComments={loadingComments}
          showModal={showModal}
          setShowModal={setShowModal}
          handleMore={handleMoreComments}
          disableShowMore={commentPageNum === commentTotalPageNum}
        />
      </Container>
    </div>
  );
};

export default App;
```

- In `src/components/IssueModal/index.js`

```javascript
import React from "react";
import { Button, Media, Modal } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import Moment from "react-moment";
import { ClipLoader } from "react-spinners";

const IssueModal = ({
  issue,
  comments,
  loadingComments,
  showModal,
  setShowModal,
  handleMore,
  disableShowMore,
}) => {
  return (
    issue && (
      <Modal
        size="xl"
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby="issue-detail-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="issue-detail-modal">
            <span className="mr-2">#{issue.number}</span>
            <span>{issue.title}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ReactMarkdown source={issue.body} />
          <hr />
          <h4>Comments:</h4>
          <ul className="list-unstyled">
            {comments && comments.length ? (
              comments.map((comment) => (
                <Comments key={comment.id} {...comment} />
              ))
            ) : (
              <li>There are no comments of this issue</li>
            )}
          </ul>
          <div className="d-flex justify-content-center">
            {loadingComments ? (
              <ClipLoader color="#f86c6b" size={75} loading={loadingComments} />
            ) : (
              <>
                {!disableShowMore && (
                  <Button
                    type="button"
                    onClick={handleMore}
                    disabled={disableShowMore}
                  >
                    Show More
                  </Button>
                )}
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>
    )
  );
};

const Comments = ({ user, body, created_at }) => {
  return (
    <Media as="li" className="mb-3">
      <img
        src={user.avatar_url}
        alt="User Avatar"
        className="avatar mr-3"
      />
      <Media.Body className="text-left">
        <div>
          <span className="text-grey mr-2">@{user.login}</span>
          <span className="text-grey">
            commented <Moment fromNow>{created_at}</Moment>
          </span>
        </div>
        <ReactMarkdown source={body} />
      </Media.Body>
    </Media>
  );
};

export default IssueModal;
```


Good job! [Back to instructions](../README.md)