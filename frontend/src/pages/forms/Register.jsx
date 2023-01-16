import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { useDispatch,useSelector} from 'react-redux'
import "./form.css";
import { registerUser } from '../../redux/apiCalls/authApiCall';
import swal from "sweetalert";

const Register = () => {

  const dispatch = useDispatch();
  const { registerMessage} = useSelector(state=> state.auth)

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // form submit handler
  const formSubmitHanler = (e)=>{
      e.preventDefault();

      if(username.trim() === "") return toast.error("Username is required");
      if(email.trim() === "") return toast.error("email is required");
      if(password.trim() === "") return toast.error("password is required");

      dispatch(registerUser({username, email, password}))

  }
  const navigate = useNavigate();
  if(registerMessage){
    swal({
      title : registerMessage,
      icon: "success",
    }).then(isOk=> {
      if(isOk){
        navigate('/login')
      }
    })
  }
  

  return (
    <section className="form-container">
      <h1 className="form-title">
        Create New Account
      </h1>
      <form onSubmit={formSubmitHanler} className="form">
        <div className="form-group">
          <label htmlFor="username" className="form-label">User Name</label>
          <input
           type="text"
           className="form-input"
           id='username'
           placeholder='Enter your Username'
           value={username}
           onChange={(e) => setUsername(e.target.value)}
           />
        </div>
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
        <button type="submit" className='form-btn'>Register</button>
      </form>
      <div className="form-footer">
        Already have an Account ? <Link to="/login">Login</Link> 
      </div>
    </section>
  )
}

export default Register