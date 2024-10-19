import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './Register.css'

function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [err, setErr] = useState('')
  const navigate = useNavigate()

  async function onRegisterFormSubmit(userObj) {
    try {
      const apiEndpoint=userObj.userType==='author'?'http://localhost:4000/author-api/author':'http://localhost:4000/user-api/user'
      const res = await axios.post(apiEndpoint, userObj)
      if (res.data.message === "User created successfully!" || res.data.message === "Author created successfully!") {
        navigate('/login')
      } else {
        setErr(res.data.message || "An unexpected error occurred")
      }
    } catch (error) {
      console.error("Registration error:", error)
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error data:", error.response.data)
        console.error("Error status:", error.response.status)
        console.error("Error headers:", error.response.headers)
        setErr(`Server error: ${error.response.data.message || error.response.statusText}`)
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request)
        setErr("No response from server. Please try again later.")
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message)
        setErr(`Error: ${error.message}`)
      }
    }
  }

  return (
    <div className="register-container">
      <h1>Register here</h1>
      <div className='form-container'>
        {err && <p className='error-message'>{err}</p>}
        <form onSubmit={handleSubmit(onRegisterFormSubmit)}>
          <div className="radio-group">
            <label className="radio-label">
              <input 
                type="radio" 
                value="author" 
                {...register("userType", { required: "User type is required" })}
                className="radio-input" 
              />
              <span className="radio-button"></span>
              Author
            </label>
            <label className="radio-label">
              <input 
                type="radio" 
                value="user" 
                {...register("userType", { required: "User type is required" })}
                className="radio-input" 
              />
              <span className="radio-button"></span>
              User
            </label>
          </div>
          {errors.userType && <p className="error-message">{errors.userType.message}</p>}
          
          <input type="text" placeholder='Username' {...register("username", { required: "Username is required" })} />
          {errors.username && <p className="error-message">{errors.username.message}</p>}
          
          <input type="password" placeholder='Password' {...register("password", { required: "Password is required" })} />
          {errors.password && <p className="error-message">{errors.password.message}</p>}
          
          <input type="email" placeholder='Email' {...register("email", { required: "Email is required" })} />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
          
          <button type='submit'>Register</button>
        </form>
      </div>
    </div>
  )
}

export default Register