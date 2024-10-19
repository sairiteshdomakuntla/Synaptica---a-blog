import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './CreatePost.css'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreatePost() {
    let { register, handleSubmit, formState: { errors } } = useForm();

    let { currentUser } = useSelector(
        (state) => state.userAuthorLoginReducer
    );
    let [err, setErr] = useState("");
    let navigate = useNavigate();
    let token=localStorage.getItem('token');

    //create axios with token
    const axiosWithToken=axios.create({
        headers:{Authorization:`Bearer ${token}`}
    })

    const postNewArticle = async(article) => {
        article.dateOfCreation = new Date();
        article.dateOfModification = new Date();
        article.articleId = Date.now();
        article.username = currentUser.username;
        article.comments = [];
        article.status = true;
        console.log(article);
        //make HTTP POST req
        let res=await axiosWithToken.post('http://localhost:4000/author-api/article',article)
        console.log("Server response:",res.data);
        if(res.data.message==='New article created'){
            navigate(`/author-profile/articles-by-author/${currentUser.username}`);
        }else{
            setErr(res.data.message);
        }
    };

    return (
        <div>
            <h1>Add a New Article</h1>
            <form onSubmit={handleSubmit(postNewArticle)}>
                <input
                    type="text"
                    placeholder="Title"
                    {...register("title", { required: "Title is required" })}
                />
                {errors.title && <p className="error-message">{errors.title.message}</p>}

                <select {...register("category", { required: "Select a category" })}>
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
                />
                {errors.content && <p className="error-message">{errors.content.message}</p>}

                <button type="submit">Post</button>
            </form>
        </div>
    );
}

export default CreatePost;
