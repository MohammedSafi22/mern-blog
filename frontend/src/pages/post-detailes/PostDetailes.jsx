import React, { useEffect, useState } from 'react'
import { Link, useParams,useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AddComment from '../../components/comments/AddComment';
import CommentList from '../../components/comments/CommentList';
import swal from 'sweetalert';
import "./post-detailes.css"
import UpdatePostModal from './UpdatePostModal';
import {useDispatch , useSelector} from "react-redux"
import { deletePost, fetchSinglePost,toggleLikePost, updatePostImage } from '../../redux/apiCalls/postApiCall';

export const PostDetailes = () => {
  const dispatch = useDispatch();
  const {post} = useSelector(state=>state.post)
  const {user} = useSelector(state=>state.auth)
  const {id} = useParams();

    const [file,setFile] = useState(null);
    const [updatePost,setUpdatePost] = useState(false);

    useEffect(()=>{
        window.scrollTo(0,0);
        dispatch(fetchSinglePost(id))
    },[id]);

    
    // update image submit handler
    const UpdateImageSubmitHandler = (e)=>{
        e.preventDefault(); 
        if(!file) return toast.warning("there is no file selected");

        const formData = new FormData();
        formData.append("image", file);
        dispatch(updatePostImage(formData,post?._id))
  }
  const navigate = useNavigate();
    // delete handler
    const deletePostHandler = ()=>{
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this post!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((isOk) => {
            if (isOk) {
              dispatch(deletePost(post?._id))
              navigate(`/profile/${user?._id}`)
            }
          });
    }

  return (
    <section className="post-detailes">
        <div className='post-detailes-image-wrapper'>
            <img src={file?URL.createObjectURL(file): post?.image.url} alt="" className="post-detailes-image" />
            {user?._id === post?.user?._id && (
              <form onSubmit={UpdateImageSubmitHandler} className="update-image-post-form">
              <label htmlFor="file" className="update-post-label">
                  <i className="bi bi-image-fill"></i>
                  Select new image
              </label>
              <input 
                style={{display:"none"}}
                type="file"
                name='file'
                id='file'
                onChange={(e) => setFile(e.target.files[0])}
              />
              <button type="submit">Upload</button>
          </form>
            )}
        </div>
        <h1 className="post-detailes-title">{post?.title}</h1>
        <div className="post-detailes-user-info">
            <img src={post?.user.profilePhoto.url} alt="" className="post-detailes-user-image" />
            <div className="post-detailes-user">
                <strong>
                    <Link to={`profile/${post?.user._id}`}>{post?.user.username}</Link>
                </strong>
                <span>
                    {new Date(post?.createdAt).toDateString()}
                </span>
            </div>
        </div>
        <p className="post-detailes-description">
            {post?.description}
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet nulla,
             corrupti asperiores sequi praesentium assumenda sint obcaecati similique itaque cum!
             Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet nulla,
             corrupti asperiores sequi praesentium assumenda sint obcaecati similique itaque cum!
             Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet nulla,
             corrupti asperiores sequi praesentium assumenda sint obcaecati similique itaque cum!
             Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet nulla,
             corrupti asperiores sequi praesentium assumenda sint obcaecati similique itaque cum!
             Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet nulla,
             corrupti asperiores sequi praesentium assumenda sint obcaecati similique itaque cum!
             Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet nulla,
             corrupti asperiores sequi praesentium assumenda sint obcaecati similique itaque cum!
             Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet nulla,
             corrupti asperiores sequi praesentium assumenda sint obcaecati similique itaque cum!
        </p>
        <div className="post-detailes-icon-wrapper">
            <div>
              { user && (
                <i
                onClick={()=>dispatch(toggleLikePost(post?._id))}
                className={
                  post?.likes.includes(user?._id)
                  ?"bi bi-hand-thumbs-up-fill"
                  :"bi bi-hand-thumbs-up"
                }></i>
              )}    
                <small>{post?.likes.length} likes</small>
            </div>
            {user?._id === post?.user?._id && (
              <div>
              <i onClick={(e)=>setUpdatePost(true)} className="bi bi-pencil-square"></i>
              <i onClick={deletePostHandler} className="bi bi-trash-fill"></i>
          </div>
            )}
        </div>
        {user ? 
        <AddComment postId={post?._id}/>
        :  
        <p className='post-detailes-info-write'>to write a comment you should login first</p>
        }
        
        <CommentList comments={post?.comments} />
        {updatePost && <UpdatePostModal post={post} setUpdatePost={setUpdatePost} />}
    </section>
  )
}
