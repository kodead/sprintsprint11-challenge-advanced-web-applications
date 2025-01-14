import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'   
import Spinner from './Spinner'
// import { application } from 'express'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate('/')}
  const redirectToArticles = () => {navigate('/articles')}

  const logout = () => {
    localStorage.removeItem('token');
    setMessage('Goodbye!');
    console.log('Logout called. Message state:', 
  )
    redirectToLogin();
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
  }

  const login = async ({ username, password }) => {
    setMessage('');
    setSpinnerOn(true);

    try {
      console.log('Stored token:', localStorage.getItem('token'));
      console.log('Login form submitted with:', { username, password });
      
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),        
      });
      console.log('response:', response)

      if(response.ok) {
        const {token, message } = await response.json();
        console.log('server response:' , { token, message} )
        localStorage.setItem('token', token);
        console.log('Token stored:', localStorage.getItem('token'));
        
        setMessage(message);
        redirectToArticles();
      } else {
        const error = await response.json();
        setMessage(error.message);
      }
      }
      catch (error) {
        console.error('Login failed', error);
        setMessage('An error occurred while logging in.');
      } finally {
        setSpinnerOn(false);
      }
    }
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    
  //   const getArticles = async () => {
  //     setMessage('');
  //     setSpinnerOn(true);
      
  //     try {
  //       const token = localStorage.getItem('token');
  //       console.log('Authorization header:', `Bearer ${token}`);
  //       const response = await fetch(articlesUrl, {
  //         headers: { Authorization: `Bearer ${token}` }, 
  //       }); 
        
  //       if( response.ok) {
  //         const articles = await response.json();
  //         setArticles(articles);
  //         setMessage('Articles retrieved successfully.');
          
  //       } else if (response.status === 401) {
  //         setMessage('Unauthorized! Please log in again.');
  //         redirectToLogin();
  //       } else { 

  //         const error = await response.json();
  //         setMessage(error.message);
            
  //       }
  //     } catch (error) {
  //     console.error('Failed to fetch articles:', error);
  //     setMessage('An error occured while fetching articles.')
  //   } finally {
  //     setSpinnerOn(false);
  //   }
  //   // We should flush the message state, turn on the spinner
  //   // and launch an authenticated request to the proper endpoint.
  //   // On success, we should set the articles in their proper state and
  //   // put the server success message in its proper state.
  //   // If something goes wrong, check the status of the response:
  //   // if it's a 401 the token might have gone bad, and we should redirect to login.
  //   // Don't forget to turn off the spinner!
  // };

  // const isTokenValid = (token) => {
  //   try {
  //     const payload = JSON.parse(atob(token.split('.')[1])); // Decode the token payload
  //     const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  //     return currentTime < payload.exp; // Check if the current time is before the expiration time
  //   } catch (error) {
  //     console.error('Invalid token format', error);
  //     return false; // If token format is invalid, treat it as expired
  //   }
  // };
  // const getArticles = async () => {
  //   setMessage('');
  //   setSpinnerOn(true);
  
  //   const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    
  //   // Validate the token
  //   if (!isTokenValid(token)) {
  //     console.error('Token has expired or is invalid');
  //     setMessage('Session expired. Please log in again.');
  //     redirectToLogin(); // Redirect to the login page if the token is invalid
  //     setSpinnerOn(false); // Stop the spinner
  //     return;
  //   }
  
  //   try {
  //     const response = await fetch(articlesUrl, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  
  //     if (response.ok) {
  //       const articles = await response.json();
  //       setArticles(articles);
  //       setMessage('Articles retrieved successfully.');
  //     } else if (response.status === 401) {
  //       setMessage('Unauthorized! Please log in again.');
  //       redirectToLogin();
  //     } else {
  //       const error = await response.json();
  //       setMessage(error.message);
  //     }
  //   } catch (error) {
  //     console.error('Failed to fetch articles:', error);
  //     setMessage('An error occurred while fetching articles.');
  //   } finally {
  //     setSpinnerOn(false);
  //   }
  // };
  
  // const getArticles = async () => {
  //   setMessage('');
  //   setSpinnerOn(true);
  
  //   try {
  //     const token = localStorage.getItem('token');
  //     console.log('Authorization header:', `Bearer ${token}`);
  
  //     if (token) {
  //       // Decode the token payload for debugging
  //       const payload = JSON.parse(atob(token.split('.')[1]));
  //       console.log('Token payload:', payload);
  //     } else {
  //       console.error('No token found in localStorage');
  //       setMessage('You need to log in first.');
  //       redirectToLogin();
  //       return;
  //     }
  
  //     const response = await fetch(articlesUrl, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  
  //     console.log('Response status:', response.status);
  //     if (response.ok) {
  //       const articles = await response.json();
  //       setArticles(articles);
  //       setMessage('Articles retrieved successfully.');
  //     } else if (response.status === 401) {
  //       const error = await response.json();
  //       console.error('Unauthorized:', error);
  //       setMessage('Unauthorized! Please log in again.');
  //       redirectToLogin();
  //     } else {
  //       const error = await response.json();
  //       console.error('Error fetching articles:', error);
  //       setMessage(error.message);
  //     }
  //   } catch (error) {
  //     console.error('Failed to fetch articles:', error);
  //     setMessage('An error occurred while fetching articles.');
  //   } finally {
  //     setSpinnerOn(false);
  //   }
  // };
    
  //   const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    
  const isTokenValid = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode the token payload
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      return currentTime < payload.exp; // Check if the current time is before the expiration time
    } catch (error) {
      console.error('Invalid token format', error);
      return false; // If token format is invalid, treat it as expired
    }
  };
  
  const prepareAuthHeaders = () => {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
  
    if (!token || !isTokenValid(token)) {
      console.error('Token has expired or is invalid');
      return null; // Return null if the token is invalid or expired
    }
  
    return { Authorization: `Bearer ${token}` }; // Return headers if the token is valid
  };
  // const getArticles = async () => {
  //   setMessage('');
  //   setSpinnerOn(true);
  
  //   const headers = prepareAuthHeaders(); // Get headers with token validation
  
  //   if (!headers) {
  //     setMessage('Session expired. Please log in again.');
  //     redirectToLogin(); // Redirect to login if token is invalid
  //     setSpinnerOn(false); // Stop the spinner
  //     return;
  //   }
  
  //   try {
  //     const response = await fetch(articlesUrl, { headers });
  
  //     if (response.ok) {
  //       const articles = await response.json();
  //       setArticles(articles);
  //       setMessage('Articles retrieved successfully.');
  //     } else if (response.status === 401) {
  //       setMessage('Unauthorized! Please log in again.');
  //       redirectToLogin();
  //     } else {
  //       const error = await response.json();
  //       setMessage(error.message);
  //     }
  //   } catch (error) {
  //     console.error('Failed to fetch articles:', error);
  //     setMessage('An error occurred while fetching articles.');
  //   } finally {
  //     setSpinnerOn(false);
  //   }
  // };
  
  const getArticles = async () => {
  setMessage('');
  setSpinnerOn(true);

  const token = localStorage.getItem('token'); // Retrieve the token from localStorage
  console.log('Stored token:', token);

  if (!isTokenValid(token)) {
    console.error('Token has expired or is invalid');
    setMessage('Session expired. Please log in again.');
    redirectToLogin();
    setSpinnerOn(false);
    return;
  }

  try {
    const headers = { Authorization: token };
    console.log('Headers before request:', headers);

    const response = await fetch(articlesUrl, { headers });
    console.log('Response status:', response.status);

    if (response.ok) {
      const articles = await response.json();
      console.log('Articles fetched successfully:', articles.articles);
      setArticles(articles.articles);
      setMessage('Articles retrieved successfully.');
    } else if (response.status === 401) {
      console.error('Unauthorized! Token may be invalid or expired.');
      setMessage('Unauthorized! Please log in again.');
      redirectToLogin();
    } else {
      const error = await response.json();
      console.error('Error from server:', error);
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
      const token = localStorage.getItem('token');
      const response = await fetch(articlesUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(article),
      });

      if (response.ok) {
        const { message, article: newArticle } = await response.json();
        setArticles((prevArticles) => [...prevArticles, newArticle]);
        setMessage(message);
      } else {
        const error = await response.json();
        setMessage(error.message);
      }
    } catch(error) {
      console.error('Failed to post article:', error);
      setMessage('An error occurred posting the article.');
    } finally {
      setSpinnerOn(false);
    }
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
  }
  
  const updateArticle = async ({ article_id, article }) => {
    setMessage('');
    setSpinnerOn(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${articlesUrl}/${article_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(article),
      });
      
      if(response.ok) {
        const { message, article: updatedArticle } = await response.json();
        setArticles((prevArticles) => 
        prevArticles.map((art) => 
          art.article_id === article_id ? updatedArticle : art
      )
    );
    setMessage(message); 
  } else {
    const error = await response.json();
    setMessage(error.message);
  }
} catch (error){ 
  console.error('Failed to update article:', error);
  setMessage('An error occured while updating the article.');
} finally {
  setSpinnerOn(false);
}
// ✨ implement
// You got this!
};

const deleteArticle = async (article_id) => {
  // ✨ implement
  setMessage('');
  setSpinnerOn(true);
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${articlesUrl}/${article_id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if(response.ok) {
      const { message } = await response.json();
      setArticles((prevArticles) => 
        prevArticles.filter((art) => art.article_id !== article_id)
    );
    setMessage(message);
  } else {
    const error = await response.json();
    setMessage(error.message);
  }
} catch (error) {
  console.error('Failed to delete article:', error);
  setMessage('A error occured while deleting the article.');
} finally {
  setSpinnerOn(false);
}

}
return (
  // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
  <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        {/* <Routes>
  <Route path="/" element={<LoginForm login={login} />} />
  <Route
    path="articles"
    element={
      localStorage.getItem('token') && (
        <>
          <ArticleForm 
            postArticle={postArticle} 
            updateArticle={updateArticle}
            currentArticle={articles.find(
              (art) => art.article_id === currentArticleId
            )}
          />
          <Articles 
            articles={articles}
            getArticles={getArticles}
            deleteArticle={deleteArticle}
            setCurrentArticleId={setCurrentArticleId}
          />
        </>
      )
    }
  />
</Routes> */}
        {/* <Routes>
          <Route
           path="/" 
           element={<LoginForm login={login} />} 
           />
          <Route 
            path="articles" 
            element={
              <ProtectedRoute token ={localStorage.getItem('token')}>
            <>
              <ArticleForm 
              postArticle={postArticle} 
              updateArticle={updateArticle}
              currentArticle={articles.find((art) => art.article_id === currentArticleId
              )}/>
              <Articles 
              articles={articles}
              getArticles={getArticles}
              deleteArticle={deleteArticle}
              setCurrentArticleId={setCurrentArticleId}/>
            </>) : 
              
          } />
        </Routes> */}
        <Routes>
          <Route
           path="/" 
           element={<LoginForm login={login} />} 
           />
          <Route 
            path="articles" 
            element={
              localStorage.getItem('token') ? (
            <>
              <ArticleForm 
              postArticle={postArticle} 
              updateArticle={updateArticle}
              currentArticle={articles.find((art) => art.article_id === currentArticleId
              )}/>
              <Articles 
              articles={articles}
              getArticles={getArticles}
              deleteArticle={deleteArticle}
              setCurrentArticleId={setCurrentArticleId}/>
            </>) : (
              <navigate to="/" replace />
            )
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}
