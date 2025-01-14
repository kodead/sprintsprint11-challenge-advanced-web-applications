import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import PT from 'prop-types';

export default function Articles({ articles, getArticles, deleteArticle, setCurrentArticleId }) {
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch articles only on the first render
    if (token) {
      getArticles();
    }
  }, [getArticles, token]);

  if (!token) {
    // Redirect to login screen if no token exists
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="articles">
      <h2>Articles</h2>
      {articles.length === 0 ? (
        <p>No articles yet</p>
      ) : (
        articles.map((article) => (
          <div className="article" key={article.article_id}>
            <div>
              <h3>{article.title}</h3>
              <p>{article.text}</p>
              <p>Topic: {article.topic}</p>
            </div>
            <div>
              <button onClick={() => setCurrentArticleId(article.article_id)}>Edit</button>
              <button onClick={() => deleteArticle(article.article_id)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// 🔥 No touchy: Articles expects the following props exactly:
Articles.propTypes = {
  articles: PT.arrayOf(PT.shape({ // the array can be empty
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })).isRequired,
  getArticles: PT.func.isRequired,
  deleteArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticleId: PT.number, // can be undefined or null
}
