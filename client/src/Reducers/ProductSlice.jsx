import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import API from "../Utils/API";

const initialState = {
    products: [],
    filter: {
        category: null,
        price: 0,
        rating: 0
    },
    search: '',
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 8,
    isNext: false,
    totalCount: null,
    isLoading: false,
    error: null,
    message: null,
}

export const FetchAllProducts = createAsyncThunk("fetchAllProducts", async (data, thunkApi) => {
    try {
        let params = {};
        const {limit, page, sortBy, sortOrder, filter: {category, rating, price}, search} = data;
        if (page) params["page"] = page
        if (limit) params["limit"] = limit
        if (category) params["category"] = category;
        if (sortBy) params["sortBy"] = sortBy
        if (sortOrder) params["sortOrder"] = sortOrder;
        if (price > 0) params["price"] = price;
        if (rating) params["rating"] = rating;
        if (search) params["search"] = search;
        const response = await API({method: "GET", url: "product/", params});
        return response?.data;
    } catch (error) {
        return thunkApi.rejectWithValue(error?.response?.data);
    }
})


const ProductSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        reset: (state) => {
            return {...state, error: null, message: null};
        },
        handlePageChange: (state, action) => {
            const {page} = action.payload;
            return {...state, page}
        },
        handleSortChange: (state, action) => {
            const {sortBy, sortOrder} = action.payload;
            return {
                ...state,
                sortBy,
                sortOrder,
                page: 1,
                filter: {category: null, rating: null, price: null}
            }
        },
        handleFilterChange: (state, action) => {
            const {category, rating, price, search} = action.payload;
            return {
                ...state,
                filter: {category, rating, price},
                page: 1,
                sortBy: "createdAt",
                sortOrder: "desc",
                search
            }
        },
        handleSearchChange: (state, action) => {
            const {search} = action.payload;
            return {...state, search, page: 1, sortBy: "createdAt", sortOrder: "desc"}
        }
    },
    extraReducers: {
        [FetchAllProducts.pending]: (state, action) => {
            return {...state, isLoading: true, error: null, message: null}
        },
        [FetchAllProducts.fulfilled]: (state, action) => {
            const {products, totalCount, IsNext} = action.payload;
            return {...state, isLoading: false, products, totalCount, isNext: IsNext}
        },
        [FetchAllProducts.rejected]: (state, action) => {
            const {error} = action.payload;
            return {...state, isLoading: false, error}
        },
    }
})

export const {actions: ProductsActions, reducer: ProductsReducers} = ProductSlice
