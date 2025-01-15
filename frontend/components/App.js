import React, { useState } from 'react';
import { NavLink, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Articles from './Articles';
import LoginForm from './LoginForm';
import Message from './Message';
import ArticleForm from './ArticleForm';
import Spinner from './Spinner';

const articlesUrl = 'http://localhost:9000/api/articles';
const loginUrl = 'http://localhost:9000/api/login';

export default function App() {
  const [message, setMessage] = useState('');
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState();
  const [spinnerOn, setSpinnerOn] = useState(false);

  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token'); // Checks if token exists
  const getToken = () => localStorage.getItem('token'); // Reusable function for token

  const redirectToLogin = () => navigate('/');
  const redirectToArticles = () => navigate('/articles');

  const logout = () => {
    localStorage.removeItem('token');
    setMessage('Goodbye!');
    redirectToLogin();
  };

  const login = async ({ username, password }) => {
    setMessage('');
    setSpinnerOn(true);

    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const { token, message } = await response.json();
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        setMessage(message);
        redirectToArticles();
      } else {
        const error = await response.json();
        setMessage(error.message);
      }
    } catch (error) {
      console.error('Login failed:', error);
      setMessage('An error occurred while logging in.');
    } finally {
      setSpinnerOn(false);
    }
  };

  const getArticles = async () => {
    setMessage('');
    setSpinnerOn(true);
    
    const token = getToken();
    if (!token) {
      setMessage('Unauthorized! Please log in again.');
      redirectToLogin();
      setSpinnerOn(false);
      return;
    }

    try {
      const response = await fetch(articlesUrl, {
        headers: { Authorization: token },
      });

      if (response.ok) {
        const fetchedArticles = await response.json();
        setArticles(fetchedArticles.articles);
        
        setMessage(fetchedArticles.message);
      } else if (response.status === 401) {
        setMessage('Unauthorized! Please log in again.');
        redirectToLogin();
      } else {
        const error = await response.json();
        setMessage(error.message);
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      setMessage('An error occurred while fetching articles.');
    } finally {
      setSpinnerOn(false);
    }
  };

  const postArticle = async (article) => {
    setMessage('');
    setSpinnerOn(true);

    try {
      const token = getToken();
      const response = await fetch(articlesUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: token },
        body: JSON.stringify(article),
      });

      if (response.ok) {
        const { message, article: newArticle } = await response.json();
        setArticles((prevArticles) => [...prevArticles, newArticle]);
        setMessage(message);
        console.log(message)
      } else {
        const error = await response.json();
        setMessage(error.message);
      }
    } catch (error) {
      console.error('Failed to post article:', error);
      setMessage('An error occurred posting the article.');
    } finally {
      setSpinnerOn(false);
    }
  };

  const updateArticle = async ({ article_id, title, text, topic }) => {
  setMessage('');
  setSpinnerOn(true);

  try {
    const token = getToken();
    const response = await fetch(`${articlesUrl}/${article_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: token },
      body: JSON.stringify({ title, text, topic }),
    });

    if (response.ok) {
      const { article: updatedArticle } = await response.json();
      setArticles((prevArticles) =>
        prevArticles.map((art) => (art.article_id === article_id ? updatedArticle : art))
      );

      // Use the username stored in localStorage for the message
      const username = localStorage.getItem('username');
      setMessage(`Nice update, ${username}!`);
    } else {
      const error = await response.json();
      setMessage(error.message);
    }
  } catch (error) {
    console.error('Failed to update article:', error);
    setMessage('An error occurred while updating the article.');
  } finally {
    setSpinnerOn(false);
  }
};

  const deleteArticle = async (article_id) => {
    setMessage('');
    setSpinnerOn(true);

    try {
      const token = getToken();
      const response = await fetch(`${articlesUrl}/${article_id}`, {
        method: 'DELETE',
        headers: { Authorization: token },
      });

      if (response.ok) {
        const { message } = await response.json();
        setArticles((prevArticles) => prevArticles.filter((art) => art.article_id !== article_id));
        setMessage(message);
      } else {
        const error = await response.json();
        setMessage(error.message);
      }
    } catch (error) {
      console.error('Failed to delete article:', error);
      setMessage('An error occurred while deleting the article.');
    } finally {
      setSpinnerOn(false);
    }
  };

  return (
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>
        Logout from app
      </button>
      <div id="wrapper" style={{ opacity: spinnerOn ? '0.25' : '1' }}>
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">
            Login
          </NavLink>
          <NavLink id="articlesScreen" to="/articles">
            Articles
          </NavLink>
        </nav>

        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route
            path="articles"
            element={
              isAuthenticated ? (
                <>
                  <ArticleForm
                    postArticle={postArticle}
                    updateArticle={updateArticle}
                    setCurrentArticleId={setCurrentArticleId}
                    currentArticle={articles.find((art) => art.article_id === currentArticleId)}
                  />
                  <Articles
                    articles={articles}
                    getArticles={getArticles}
                    deleteArticle={deleteArticle}
                    setCurrentArticleId={setCurrentArticleId}
                  />
                </>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  );
}
