import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

function UserProfile() {
  return (
    <div>
      {/* <h1>User Profile</h1> */}/
      <NavLink to={`/user-profile/articles`} className={({ isActive }) => isActive ? 'active-link' : ''}>
        Articles
      </NavLink>
      <Outlet/>
    </div>
  )
}

export default UserProfile;
