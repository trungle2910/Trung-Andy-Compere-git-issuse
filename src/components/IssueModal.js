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
      <img src={user.avatar_url} alt="User Avatar" className="avatar mr-3" />
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
