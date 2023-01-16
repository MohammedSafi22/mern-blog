import { Link } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import { useState } from 'react';
import { logoutUser } from '../../redux/apiCalls/authApiCall';

const HeaderRight = () => {
  const dispatch = useDispatch();
 
  const { user } = useSelector(state=> state.auth);
  const [dropdown,setDropdown] = useState(false);


  return (
    <div className="heder-right">
        {user? 
        <>
          <div className='header-right-user-info' onClick={()=>setDropdown(prev => !prev)}>
             <span className='header-right-username'>
              {user?.username}
             </span>
             <img src={user.profilePhoto?.url} alt="user photo" className='header-right-user-photo'/>
             {dropdown && (
              <div className="header-right-dropdown">
              <Link 
               to={`/profile/${user?._id}`}
               className='header-dropdown-item'
               onClick={()=>setDropdown(true)}
               >
                <i className="bi bi-file-person"></i>
                <span>profile</span>
              </Link>
              <div onClick={()=>dispatch(logoutUser())} className='header-dropdown-item'>
                <i className="bi bi-box-arrow-in-left"></i>
                <span>logout</span>
              </div>
            </div>
             )}
          </div>
          
        </>:
        (<>
          <Link to="/login" className="header-right-link">
          <i className="bi bi-box-arrow-in-right"></i>
          <span>Login</span>
        </Link>
        <Link to="register" className="header-right-link">
          <i className="bi bi-person-plus"></i>
          <span>Register</span>
        </Link>
        </>)        
      }
      </div>
  )
}

export default HeaderRight