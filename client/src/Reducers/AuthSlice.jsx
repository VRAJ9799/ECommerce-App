import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import API from "../Utils/API";
import {toast} from "react-hot-toast";


const initialState = {
    user: null,
    token: null,
    isLoggedIn: false,
    isLoading: false,
    message: null,
    error: null,
}

export const LoginUser = createAsyncThunk("login", async (data, thunkApi) => {
    try {
        const response = await API({method: "POST", url: "auth/login", data})
        return response.data;
    } catch (error) {
        return thunkApi.rejectWithValue(error?.response.data)
    }
})


const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        alreadyLoggedIn: (state, action) => {
            const {user, token} = action.payload;
            return {...state, message: null, user, token, isLoggedIn: true};
        },
        reset: (state) => {
            return {...state, error: null, message: null}
        },
        handleChangeProfile: (state, action) => {
            const {user} = action.payload;
            return {...state, user};
        },
        logOut: (state, action) => {
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("token");
            toast.success("You logged out successfully")
            return {...state, user: null, token: null, isLoggedIn: false}
        }
    },
    extraReducers: {
        [LoginUser.pending]: (state, action) => {
            return {...state, isLoading: true}
        },
        [LoginUser.fulfilled]: (state, action) => {
            const {message, user, token} = action.payload;
            toast.success(message);
            return {...state, isLoading: false, isLoggedIn: true, message, user, token}
        },
        [LoginUser.rejected]: (state, action) => {
            const {error} = action.payload || {error: "Server Error"};
            toast.error(error);
            return {...state, isLoading: false, error}
        }
    }
})

export const {actions: AuthActions, reducer: AuthReducers} = AuthSlice;