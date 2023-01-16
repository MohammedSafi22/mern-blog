import { useState } from 'react';
import { useDispatch } from 'react-redux'
import { updateProfile } from '../../redux/apiCalls/profileApiCall';
import './update-profile.css';



const UpdateProfileModal = ({setUpdateProfile,profile}) => {
  const dispatch = useDispatch();

   const[username,setUsername] = useState(profile.username);
   const[bio,setBio] = useState(profile.bio);
   const[password,setPassword] = useState("");

   //form submit handler
   const formSubmitHandler = (e) => {
       e.preventDefault();
       const updatedUser = {username, bio}

       if(password.trim() !== ""){
        updatedUser.password = password;
       }
       dispatch(updateProfile(profile._id, updatedUser));
       setUpdateProfile(false);
   }

  return (
    <div className="update-profile">
      <form onSubmit={formSubmitHandler} className="update-profile-form">
         <abbr title="close">
            <i onClick={()=>setUpdateProfile(false)} className="bi bi-x-circle-fill update-profile-form-close"></i>
         </abbr>
         <h1 className="update-profile-title">Update profile</h1>
         <input
           type="text"
           className='update-profile-input' 
           value={username} 
           onChange={(e)=> setUsername(e.target.value)}
           placeholder="User Name"
           />
           <input
           type="text"
           className='update-profile-input' 
           value={bio} 
           onChange={(e)=> setBio(e.target.value)}
           placeholder="Bio"
           />
           <input
           type="password"
           className='update-profile-input' 
           value={password} 
           onChange={(e)=> setPassword(e.target.value)}
           placeholder="Password"
           />
         <button type='submit' className='update-profile-btn'>Update your profile</button>
      </form>
    </div>
  )
}

export default UpdateProfileModal