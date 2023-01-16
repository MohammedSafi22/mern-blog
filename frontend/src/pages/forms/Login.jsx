import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import "./form.css";
import { useDispatch } from 'react-redux';
import { loginUser } from '../../redux/apiCalls/authApiCall';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch()

  // form submit handler
  const formSubmitHanler = (e)=>{
      e.preventDefault();

      if(email.trim() === "") return toast.error("email is required");
      if(password.trim() === "") return toast.error("password is required");

      // console.log({ email , password});
      dispatch(loginUser({ email, password}))
  }
  
  return (
    <section className="form-container">
      <h1 className="form-title">
        Login to your Account
      </h1>
      <form onSubmit={formSubmitHanler} className="form">
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
           type="email"
           className="form-input"
           id='email'
           placeholder='Enter your Email'
           value={email}
           onChange={(e) => setEmail(e.target.value)}
           />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <input
           type="password"
           className="form-input"
           id='password'
           placeholder='Enter your password'
           value={password}
           onChange={(e) => setPassword(e.target.value)}
           />
        </div>
        <button type="submit" className='form-btn'>Login</button>
      </form>
      <div className="form-footer">
        Did you Forgot Your Password ? <Link to="/forgot-password">Forgot Password</Link> 
      </div>
    </section>
  )
}

export default Login