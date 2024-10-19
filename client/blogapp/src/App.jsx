import React from 'react';
import { Suspense } from 'react';
import { lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './App.css';
import Register from './registration/Register';
import Login from './login/Login';
import Header from './header/Header';
// import Footer from './footer/Footer';
const Footer=lazy(()=>import('./footer/Footer'))
import Home from './home/Home';
import UserProfile from './profiles/UserProfile';
import AuthorProfile from './profiles/AuthorProfile';
import CreatePost from './author/CreatePost';
import MyPosts from './author/MyPosts';
import Article from './author/Article';
import ArticlesByAuthor from './author/ArticlesByAuthor';

function App() {
  // Access currentUser from Redux store
  const currentUser = useSelector((state) => state.userAuthorLoginReducer.currentUser);

  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* User Profile with Nested Routes */}
            <Route path="/user-profile" element={<UserProfile />}>
              <Route path="articles" element={<MyPosts />} />
              <Route path="article/:articleId" element={<Article />} />
              {/* Set default nested route to show articles list */}
              <Route index element={<Navigate to="articles" />} />
            </Route>

            {/* Author Profile with Nested Routes */}
            <Route path="/author-profile" element={<AuthorProfile />}>
              <Route path="new-article" element={<CreatePost />} /> {/* Nested route for creating a new post */}
              <Route path="articles-by-author/:author" element={<ArticlesByAuthor />} />
              <Route path="article/:articleId" element={<Article />} />
              <Route path='' element={<Navigate to='articles-by-author/:author' />} />
            </Route>

            {/* Fallback for invalid routes */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Suspense><Footer /></Suspense>
      </div>
    </Router>
  );
}

export default App;
