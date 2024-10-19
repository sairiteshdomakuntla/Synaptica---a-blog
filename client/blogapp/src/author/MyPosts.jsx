import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { axiosWithToken } from '../axiosWithToken';
import './MyPosts.css'

function MyPosts() {
  const [articlesList, setArticlesList] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.userAuthorLoginReducer);

  const getAllArticles = async () => {
    try {
    
      let res = await axiosWithToken.get(
        'http://localhost:4000/user-api/articles' // Call to get all articles
      );
      // console.log("API Response:", res); // Check API response
      if (res.data.payload) {
        setArticlesList(res.data.payload);
      } else {
        setArticlesList([]);
        // console.error("Payload is not an array", res.data.payload);
      }
    } catch (err) {
      // console.error("Error fetching articles:", err);
      setArticlesList([]);
    }
  };

  const readArticleByArticleId = (articleObj) => {
    navigate(`../article/${articleObj.articleId}`, { state: articleObj });
  };

  useEffect(() => {
    // console.log("Current User:", currentUser); // Check the logged-in user
    if (currentUser) {
      getAllArticles(); // Fetch all articles instead of only the current user's articles
    }
  }, [currentUser]);  

  return (
    <div className="articles-container">
      <h1>All Articles</h1> {/* Changed to reflect all articles */}
      <div className="articles-list">
        {articlesList.length > 0 ? (
          articlesList.map((article, index) => (
            <div className="article-card" key={index}>
              <h3>{article.title}</h3>
              <p>{article.content.substring(0, 80)} ...</p>
              <button onClick={() => readArticleByArticleId(article)}>
                Read More
              </button>
              <small>
                Last updated on{' '}
                {new Date(article.dateOfModification).toLocaleDateString()}
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

export default MyPosts;
