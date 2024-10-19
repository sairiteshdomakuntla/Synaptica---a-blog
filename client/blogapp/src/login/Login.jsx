import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { userAuthorLoginThunk, logout } from '../redux/slices/userAuthorSlice';
import { useNavigate } from 'react-router-dom';

function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { isLoggedIn, userType, errorOccured, errMsg, isPending } = useSelector(state => state.userAuthorLoginReducer);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function onLoginFormSubmit(userObj) {
        dispatch(userAuthorLoginThunk(userObj))
        .unwrap()
        .then((originalPromiseResult) => {
            // handle result here
            console.log("Login successful", originalPromiseResult);
        })
        .catch((rejectedValueOrSerializedError) => {
            // handle error here
            console.error("Login failed", rejectedValueOrSerializedError);
        });
    }

    function handleLogout() {
        dispatch(logout());
    }

    useEffect(() => {
        if (isLoggedIn) {
            if (userType === 'user') {
                navigate('/user-profile'); // Navigate to user profile
            } else if (userType === 'author') {
                navigate('/author-profile');
            }
        }
    }, [isLoggedIn, userType, navigate]);

    if (isLoggedIn) {
        return (
            <div>
                <h1>Welcome, {userType}!</h1>
                <button onClick={handleLogout}>Sign Out</button>
            </div>
        );
    }

    return (
        <div>
            <h1>Please Login to continue...</h1>
            <div className='form-container'>
                <form onSubmit={handleSubmit(onLoginFormSubmit)}>
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

                    <input 
                        type="text" 
                        placeholder='Username' 
                        {...register("username", { required: "Username is required" })} 
                    />
                    {errors.username && <p className="error-message">{errors.username.message}</p>}

                    <input 
                        type="password" 
                        placeholder='Password' 
                        {...register("password", { required: "Password is required" })} 
                    />
                    {errors.password && <p className="error-message">{errors.password.message}</p>}

                    <button type='submit' disabled={isPending}>
                        {isPending ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                {errorOccured && <p className="error-message">{errMsg}</p>}
            </div>
        </div>
    );
}

export default Login;
