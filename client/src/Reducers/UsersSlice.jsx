import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import API from "../Utils/API";

const initialState = {
    userList: [],
    search: null,
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 10,
    isNext: false,
    totalCount: null,
    isLoading: false,
    error: null,
    message: null,
}

export const FetchAllUsers = createAsyncThunk("/fetchusers", async (data, thunkApi) => {
    try {
        const params = {};
        const {search, page, limit} = data;
        if (search) params["search"] = search;
        if(page) params["page"]=page;
        if(limit) params["limit"]=limit;
        const response = await API({method: "GET", url: "user/", params:params, privateRoute: true});
        return response?.data;
    } catch (error) {
        return thunkApi.rejectWithValue(error?.response?.data);
    }
})

const UserSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        reset: (state, action) => {
            return {...state, error: null, message: null};
        },
        handleSearchChange: (state, action) => {
            const {search} = action.payload;
            return {...state, search, page: 1};
        },
        handlePageChange: (state, action) => {
            const {page} = action.payload;
            return {...state, page}
        }
    },
    extraReducers: {
        [FetchAllUsers.pending]: (state, action) => {
            return {...state, isLoading: true, error: null, message: null}
        },
        [FetchAllUsers.fulfilled]: (state, action) => {
            const {users, totalCount, isNext} = action.payload;
            return {...state, userList: users, totalCount, isNext, isLoading: false};
        },
        [FetchAllUsers.rejected]: (state, action) => {
            const {error} = action.payload;
            return {...state, error, isLoading: false}
        }
    }
})

export const {name: UserKeyName, actions: UserActions, reducer: UserReducers} = UserSlice;