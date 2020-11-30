import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert, Container } from "react-bootstrap";
import PublicNavbar from "./components/PublicNavbar";
import { ClipLoader } from "react-spinners";
import SearchForm from "./components/SearchForm";
import PaginationBar from "./components/PaginationBar";
import IssueModal from "./components/IssueModal";
import IssueList from "./components/IssueList";

function App() {
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("facebook/react");
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [issues, setIssues] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [totalPageNum, setTotalPageNum] = useState(1);
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

  // useEffect(() => {
  //   const fetchComments = async () => {
  //     if (!urlFetchComments && !showModal) return;
  //     setLoadingComments(true);
  //     try {
  //       const response = await fetch(urlFetchComments);
  //       const data = await response.json();
  //       if (response.status === 200) {
  //         const link = response.headers.get("link");
  //         if (link) {
  //           const getTotalPage = link.match(
  //             /page=(\d+)&per_page=\d+>; rel="last"/
  //           );
  //           if (getTotalPage) {
  //             setCommentTotalPageNum(parseInt(getTotalPage[1]));
  //           }
  //         }
  //         setComments((c) => [...c, ...data]);
  //         setErrorMessage(null);
  //       } else {
  //         setErrorMessage(`FETCH COMMENTS ERROR: ${data.message}`);
  //         setShowModal(false);
  //       }
  //     } catch (error) {
  //       setErrorMessage(`FETCH COMMENTS ERROR: ${error.message}`);
  //       setShowModal(false);
  //     }
  //     setLoadingComments(false);
  //   };
  //   fetchComments();
  // }, [urlFetchComments, showModal]);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // searchInput = owner/repo
    const temp = searchInput.split("/");
    if (temp.length === 2) {
      setOwner(temp[0]);
      setRepo(temp[1]);
    } else {
      setErrorMessage("Wrong format of search input");
    }
  };

  useEffect(() => {
    if (!owner || !repo) return;
    const fetchIssueData = async () => {
      setLoading(true);
      try {
        const url = `https://api.github.com/repos/${owner}/${repo}/issues?page=${pageNum}&per_page=20`;
        const res = await fetch(url);
        const data = await res.json();
        if (res.status === 200) {
          const link = res.headers.get("link");
          if (link) {
            const getTotalPage = link.match(
              /page=(\d+)&per_page=\d+>; rel="last"/
            );
            if (getTotalPage) setTotalPageNum(Number(getTotalPage[1]));
          }
          setIssues(data);
          setErrorMessage("");
        } else {
          setErrorMessage(data.message);
          setIssues([]);
        }
      } catch (error) {
        setErrorMessage(error.message);
      }
      setLoading(false);
    };
    fetchIssueData();
  }, [owner, repo, pageNum]);

  return (
    <>
      <PublicNavbar />
      <Container>
        <h1 className="text-center">Github Issues</h1>
        <SearchForm
          loading={loading}
          searchInput={searchInput}
          handleSearchChange={handleSearchChange}
          handleSubmit={handleSubmit}
        />
        <div className="d-flex flex-column align-items-center">
          {errorMessage && (
            <Alert variant="danger" className="mt-4">
              {errorMessage}
            </Alert>
          )}
          <PaginationBar
            pageNum={pageNum}
            setPageNum={setPageNum}
            totalPageNum={totalPageNum}
          />
        </div>
        {loading ? (
          <ClipLoader color="#f86c6b" size={150} loading={true} />
        ) : (
          <IssueList itemList={issues} showDetail={showDetail} />
        )}
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
    </>
  );
}

export default App;
