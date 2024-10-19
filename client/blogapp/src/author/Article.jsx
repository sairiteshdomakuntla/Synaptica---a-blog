import React, { useState } from 'react';
import './Article.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { FaRegCalendarDays } from "react-icons/fa6";
import { IoIosTimer } from "react-icons/io";
import { axiosWithToken } from '../axiosWithToken';
import { FcPortraitMode } from "react-icons/fc";
import { RiCheckboxBlankCircleFill } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MdOutlineRestorePage } from "react-icons/md";

function Article() {
    let { currentUser } = useSelector((state) => state.userAuthorLoginReducer);
    let { register, handleSubmit, formState: { errors } } = useForm(); // Include errors
    let [comment, setComment] = useState('');
    let [articleEditStatus, setArticleEditStatus] = useState(false);
    let { state } = useLocation();
    // let [isDeleted, setIsDeleted] = useState(state.status === false);
    let [currentArticle, setCurrentArticle]=useState(state);
    let navigate=useNavigate();

    const deleteArticle=async()=>{
        let art={...currentArticle};
        delete art._id;
        let res=await axiosWithToken.put(`http://localhost:4000/author-api/article/${currentArticle.articleId}`,art);
        if(res.data.message==="Article removed"){
            setCurrentArticle({...currentArticle,status:res.data.payload})
        }
    }
    const restoreArticle=async()=>{
        let art={...currentArticle};
        delete art._id;
        let res=await axiosWithToken.put(`http://localhost:4000/author-api/article/${currentArticle.articleId}`,art);
        if(res.data.message==="Article restored"){
            setCurrentArticle({...currentArticle,status:res.data.payload})
        }
    }



    // Add comment to an article by user
    const addCommentByUser = async (commentObj) => {
        commentObj.username = currentUser.username;
        let res = await axiosWithToken.post(`http://localhost:4000/user-api/comment/${state.articleId}`, commentObj);
        console.log(res.data);
        if (res.data.message === "Comment posted") {
            setComment(res.data.message);
        }
    };

    // Enable edit state
    const enableEditState = () => {
        setArticleEditStatus(true);
    };

    // Disable edit state
    const saveModifiedArticle = async(editedArticle) => {

      let modifiedArticle={...state, ...editedArticle}
      //change date of modification
      modifiedArticle.dateOfModification=new Date();
      //remove _id
      delete modifiedArticle._id;

      //make http put req to save modified article in db
      let res=await axiosWithToken.put('http://localhost:4000/author-api/article',modifiedArticle)
      if(res.data.message==="Article modified"){
        setArticleEditStatus(false);
        navigate(`/author-profile/article/${modifiedArticle.articleId}`,{state:res.data.article})
      }

      console.log("Modified Article:",editedArticle)
      
      setArticleEditStatus(false);
  };

  // Soft delete article by updating status to false
// const deleteArticle = async () => {
//     let modifiedArticle = { ...state, status: false };
//     delete modifiedArticle._id;

//     let res = await axiosWithToken.put(`http://localhost:4000/author-api/article`, modifiedArticle);

//     if (res.data.message === "Article removed") {
//         setIsDeleted(true);  // Mark article as deleted in the UI
//     }

//     console.log("Soft deleted article:", modifiedArticle);
// };
// const deleteArticle = async () => {
//     let res = await axiosWithToken.put(`http://localhost:4000/author-api/article/delete/${state.articleId}`);
//     if (res.data.message === "Article removed") {
//         setIsDeleted(true);
//     }
// };
// const restoreArticle = async () => {
//     let res = await axiosWithToken.put(`http://localhost:4000/author-api/article/restore/${state.articleId}`);
//     if (res.data.message === "Article restored") {
//         setIsDeleted(false);
//     }
// };

// Restore article by updating status to true
// const restoreArticle = async () => {
//     let modifiedArticle = { ...state, status: true };
//     delete modifiedArticle._id;

//     let res = await axiosWithToken.put(`http://localhost:4000/author-api/article`, modifiedArticle);

//     if (res.data.message === "Article restored") {
//         setIsDeleted(false);  // Mark article as restored in the UI
//     }

//     console.log("Restored article:", modifiedArticle);
// };

    return (
        <div className="article-container">
            {articleEditStatus === false ? (
                <>
                    <div className="d-flex justify-content-between">
                        <div>
                            <p className="article-title">{state.title}</p>
                            <span className="article-meta">
                                <FaRegCalendarDays className='fs-4' />
                                <small>Created on: {state.dateOfCreation}</small>
                                <p></p>
                                <IoIosTimer className='fs-4' />
                                <small>Modified on: {state.dateOfModification}</small>
                            </span>
                        </div>
                        <div>
                            {currentUser.userType === 'author' && (
                            <div className="article-actions">
                                <span onClick={enableEditState}>
                                    Edit <FaEdit className="action-icon" />
                                </span>
                            {currentArticle.status===true ? (
                                <>
                                <span onClick={deleteArticle}>
                                    Delete <MdDelete className="action-icon" />
                                </span>
                                </>
                            ) : (
                                <span onClick={restoreArticle}>
                                    Restore <MdOutlineRestorePage className="action-icon" />
                                </span>
                            )}
                        </div>
                            )}
                        </div>
                    </div>
                    <p className="article-content">{state.content}</p>
                    {/* User comments */}
                    <div>
                        {/* Read existing comments */}
                        <div className="comments my-4">
                            {state.comments.length === 0 ? (
                                <p className='no-comments'>No comments yet...</p>
                            ) : (
                                state.comments.map((commentObj, ind) => {
                                    return (
                                        <div key={ind} className='comment'>
                                            <p className='comment-username'>
                                                <FcPortraitMode className='fs-2 me-2' />
                                                {commentObj.username}
                                            </p>
                                            <div className="comment-item">
                                                <RiCheckboxBlankCircleFill className="comment-circle" />
                                                <p className="comment-text">{commentObj.comment}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                        <h1>{comment}</h1>
                        {/* Write comments by user */}
                        {currentUser.userType === 'user' && (
                            <form className="comment-form" onSubmit={handleSubmit(addCommentByUser)}>
                                <input
                                    type="text"
                                    {...register("comment")}
                                    placeholder="Write comment here..."
                                />
                                <button type="submit">Add comment</button>
                            </form>
                        )}
                    </div>
                </>
            ) : (
                <form onSubmit={handleSubmit(saveModifiedArticle)}>
                    <input
                        type="text"
                        placeholder="Title"
                        {...register("title", { required: "Title is required" })}
                        defaultValue={state.title}
                    />
                    {errors.title && <p className="error-message">{errors.title.message}</p>}

                    <select {...register("category", { required: "Select a category" })} defaultValue={state.category}>
                        <option value="">Select a Category</option>
                        <option value="programming">Programming</option>
                        <option value="tech">Tech</option>
                        <option value="life">Life</option>
                        <option value="health">Health</option>
                    </select>
                    {errors.category && <p className="error-message">{errors.category.message}</p>}

                    <textarea
                        placeholder="Content"
                        {...register("content", { required: "Content is required" })}
                        defaultValue={state.content}
                    />
                    {errors.content && <p className="error-message">{errors.content.message}</p>}

                    <button type="submit">Save</button>
                </form>
            )}
        </div>
    );
}

export default Article;