import { authActions } from "../slices/authSlice";
import request from "../../utils/request";
import {toast} from 'react-toastify';


// Login user
export function loginUser(user){
    return async (dispatch)=>{
        try {
            const {data} = await request.post("/api/auth/login",user)
            dispatch(authActions.login(data));
            localStorage.setItem("userInfo",JSON.stringify(data));
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
}

// Logout user
export function logoutUser(user){
    return (dispatch)=>{
       dispatch(authActions.logout())
       localStorage.removeItem("userInfo")
    }
}

// register user
export function registerUser(user){
    return async (dispatch)=>{
        try {
            const {data} = await request.post("/api/auth/register",user)
            dispatch(authActions.register(data.message));
            localStorage.setItem("userInfo",JSON.stringify(data));
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
}
