import React from 'react'
import { Outlet } from 'react-router-dom';

function AuthorProfile() {
  return (
    <div>
      <Outlet /> {/* This renders the nested routes */}
    </div>
    );
}

export default AuthorProfile
