import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { axiosWithToken } from '../axiosWithToken';
import './ArticlesByAuthor.css';
import { logout } from '../redux/slices/userAuthorSlice';

function ArticlesByAuthor() {
  const [articlesList, setArticlesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.userAuthorLoginReducer);

  const getArticles = async () => {
    if (!currentUser) {
      setError("User information is missing. Please try logging in again.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      let res;
      if (currentUser.userType === 'author') {
        console.log("Fetching articles for author:", currentUser.username);
        res = await axiosWithToken.get(`/author-api/articles/${currentUser.username}`);
      } else {
        console.log("Fetching all articles for user");
        res = await axiosWithToken.get('/user-api/articles');
      }
      console.log("API response:", res.data);
      if (Array.isArray(res.data.payload)) {
        setArticlesList(res.data.payload);
      } else {
        setArticlesList([]);
        console.error("Payload is not an array", res.data.payload);
      }
    } catch (err) {
      console.error("Error fetching articles:", err);
      if (err.response && err.response.status === 401) {
        setError("Your session has expired. Please log in again.");
        dispatch(logout());
        navigate('/login');
      } else {
        setError("Failed to fetch articles. Please try again later.");
      }
      setArticlesList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const readArticleByArticleId = (articleObj) => {
    navigate(`/author-profile/article/${articleObj.articleId}`, { state: articleObj });
  };  

  const editArticle = (articleObj) => {
    // Implement edit functionality
    console.log("Edit article:", articleObj);
  };

  const deleteArticle = (articleObj) => {
    // Implement delete functionality
    console.log("Delete article:", articleObj);
  };

  useEffect(() => {
    getArticles();
  }, [currentUser]);

  if (isLoading) {
    return <div className="loading">Loading articles...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="articles-container">
      <h1>{currentUser.userType === 'author' ? `Articles by ${currentUser.username}` : 'All Articles'}</h1>
      <div className="articles-list">
        {articlesList.length > 0 ? (
          articlesList.map((article, index) => (
            <div className="article-card" key={article.articleId || index}>
              <h3>{article.title}</h3>
              <p>{article.content.substring(0, 80)} ...</p>
              <button onClick={() => readArticleByArticleId(article)}>
                Read More
              </button>
              {/* {currentUser.userType === 'author' && currentUser.username === article.username && (
                <div className="author-actions">
                  <button onClick={() => editArticle(article)}>Edit</button>
                  <button onClick={() => deleteArticle(article)}>Delete</button>
                </div>
              )} */}
              <small>
                Last updated on {new Date(article.dateOfModification).toLocaleDateString()}
              </small>
            </div>
          ))
        ) : (
          <p>No articles found</p>
        )}
      </div>
    </div>
  );
}

export default ArticlesByAuthor;