import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import API from "../Utils/API";
import {toast} from "react-hot-toast";

const initialState = {
    orderList: [],
    filter: {},
    limit: 10,
    page: 1,
    totalCount: null,
    sortBy: "createdAt",
    sortOrder: "desc",
    isLoading: false,
    isNext: false,
    message: null,
    error: null,
}

export const FetchAllAdminOrders = createAsyncThunk("/fetchadminorders", async (data, thunkApi) => {
    try {
        let params = {};
        const {limit, page, sortBy, sortOrder} = data;
        if (page) params["page"] = page
        if (limit) params["limit"] = limit
        if (sortBy) params["sortBy"] = sortBy
        if (sortOrder) params["sortOrder"] = sortOrder;
        const response = await API({method: "GET", url: "order/getAllOrders", params, privateRoute: true});
        return response?.data;
    } catch (error) {
        return thunkApi.rejectWithValue(error?.response?.data)
    }
});

export const FetchMyOrders = createAsyncThunk("/fetchMyOrders", async (data, thunkApi) => {
    try {
        let params = {};
        const {limit, page, sortBy, sortOrder} = data;
        if (page) params["page"] = page
        if (limit) params["limit"] = limit
        if (sortBy) params["sortBy"] = sortBy
        if (sortOrder) params["sortOrder"] = sortOrder;
        const response = await API({method: "GET", url: "order/getMyOrders", params, privateRoute: true});
        return response?.data;
    } catch (error) {
        return thunkApi.rejectWithValue(error?.response?.data);
    }
});

const OrderSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        reset: (state, action) => {
            return {...state, error: null, message: null}
        },
        handlePageChange: (state, action) => {
            const {page} = action.payload;
            return {...state, page}
        },
        handleStateChange: (state, action) => {
            const {name, id} = action.payload;
            return {
                ...state,
                orderList: state.orderList.map((order) => (order._id === id ? {...order, [name]: true} : order))
            }
        }
    },
    extraReducers: {
        [FetchAllAdminOrders.pending]: (state, action) => {
            return {
                ...state,
                page: 1,
                limit: 10,
                isNext: false,
                totalCount: null,
                isLoading: true,
                message: null,
                error: null
            };
        },
        [FetchAllAdminOrders.fulfilled]: (state, action) => {
            const {orders, isNext, totalCount} = action.payload;
            return {...state, orderList: orders, isNext, totalCount, isLoading: false}
        },
        [FetchAllAdminOrders.rejected]: (state, action) => {
            const {error} = action.payload;
            return {...state, error, isLoading: false}
        },
        [FetchMyOrders.pending]: (state, action) => {
            return {
                ...state,
                page: 1,
                limit: 10,
                isNext: false,
                totalCount: null,
                isLoading: true,
                message: null,
                error: null
            };
        },
        [FetchMyOrders.fulfilled]: (state, action) => {
            const {orders, isNext, totalCount} = action.payload;
            return {...state, orderList: orders, isNext, totalCount, isLoading: false}
        },
        [FetchMyOrders.rejected]: (state, action) => {
            const {error} = action.payload;
            toast.error(error);
            return {...state, error, isLoading: false}
        },
    }
})


export const {name: OrderKeyName, actions: OrderActions, reducer: OrderReducers} = OrderSlice;
