import {configureStore} from "@reduxjs/toolkit";
import {AuthReducers} from "./AuthSlice";
import {ProductsReducers} from "./ProductSlice";
import logger from "redux-logger";
import {CartReducers} from "./CartSlice";
import {OrderReducers} from "./OrderSlice";
import {UserReducers} from "./UsersSlice";

export const Store = configureStore({
    reducer: {
        auth: AuthReducers,
        user:UserReducers,
        products: ProductsReducers,
        cart: CartReducers,
        orders: OrderReducers,
    },
    middleware: (getDefaultMiddleware => getDefaultMiddleware().concat(logger))
})