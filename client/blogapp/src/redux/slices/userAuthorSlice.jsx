import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const userAuthorLoginThunk = createAsyncThunk(
  'user-author-login',
  async (userCredObj, thunkApi) => {
    try {
      let res;
      if (userCredObj.userType === 'user') {
        res = await axios.post('http://localhost:4000/user-api/login', userCredObj);
      } else if (userCredObj.userType === 'author') {
        res = await axios.post('http://localhost:4000/author-api/login', userCredObj);
      }
      
      console.log('Response from server:', res.data);
      
      if (res.data.message === 'Login success!') {
        localStorage.setItem('token', res.data.token);
        return { ...res.data, user: res.data.user, userType: userCredObj.userType };
      } else {
        return thunkApi.rejectWithValue(res.data.message);
      }
    } catch (err) {
      console.error('Login error:', err);
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const userAuthorSlice = createSlice({
  name: "user-author-login",
  initialState: {
    isPending: false,
    isLoggedIn: false,
    currentUser: null,
    userType: null,
    errorOccured: false,
    errMsg: ''
  },
  reducers: {
    resetState: (state) => {
      state.isPending = false;
      state.isLoggedIn = false;
      state.currentUser = null;
      state.userType = null;
      state.errorOccured = false;
      state.errMsg = '';
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.currentUser = null;
      state.userType = null;
      localStorage.removeItem('token');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(userAuthorLoginThunk.pending, (state) => {
        state.isPending = true;
      })
      .addCase(userAuthorLoginThunk.fulfilled, (state, action) => {
        state.isPending = false;
        state.errMsg = '';
        state.errorOccured = false;
        state.isLoggedIn = true;
        state.currentUser = action.payload.user;
        state.userType = action.payload.userType;
        console.log('Updated state:', state);
      })
      .addCase(userAuthorLoginThunk.rejected, (state, action) => {
        state.isPending = false;
        state.isLoggedIn = false;
        state.currentUser = null;
        state.userType = null;
        state.errMsg = action.payload;
        state.errorOccured = true;
        console.log('Login rejected. Error:', action.payload);
      });
  }
});

export const { resetState, logout } = userAuthorSlice.actions;
export default userAuthorSlice.reducer;
