import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import API from "../Utils/API";
import {toast} from "react-hot-toast"

const initialState = {
    cart: [],
    isLoading: false,
    error: null,
    message: null,
}

export const FetchCart = createAsyncThunk("fetch_cart", async (data, thunkApi) => {
    try {
        const response = await API({method: "GET", url: "cart/", privateRoute: true});
        return response.data;
    } catch (error) {
        return thunkApi.rejectWithValue(error.response.data)
    }
})

export const AddOrUpdateCart = createAsyncThunk("add_update_cart", async (data, thunkApi) => {
    try {
        await API({method: "POST", url: "cart/addorupdate", data, privateRoute: true});
        return data;
    } catch (error) {
        return thunkApi.rejectWithValue(error.response.data)
    }
})
export const RemoveCart = createAsyncThunk("remove_cart", async (data, thunkApi) => {
    try {
        await API({method: "DELETE", url: `cart/remove/${data.id}`, privateRoute: true});
        return data;
    } catch (error) {
        return thunkApi.rejectWithValue(error.response.data)
    }
})


const CartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        reset: (state) => {
            return {...state, error: null, message: null}
        }
    },
    extraReducers: {
        [FetchCart.pending]: (state, action) => {
            return {cart: [], isLoading: true, error: null, message: null}
        },
        [FetchCart.fulfilled]: (state, action) => {
            const {cart} = action.payload;
            return {cart, isLoading: false, error: null, message: null}
        },
        [FetchCart.rejected]: (state, action) => {
            const {error} = action.payload;
            return {...state, isLoading: false, error, message: null}
        },
        [AddOrUpdateCart.pending]: (state, action) => {
            return {...state, isLoading: false, message: null, error: null}
        },
        [AddOrUpdateCart.fulfilled]: (state, action) => {
            const {ProductId, Quantity} = action.payload;
            toast.success("Cart Item Updated Successfully")
            return {
                isLoading: false, error: null, message: "Cart Item Updated Successfully",
                cart: state.cart.map((cart) =>
                    cart.ProductId._id === ProductId
                        ? {...cart, QuantityPurchased: Quantity}
                        : cart
                ),
            }
        },
        [AddOrUpdateCart.rejected]: (state, action) => {
            return {isLoading: false, error: "Error while updating cart item", message: null, cart: state.cart}
        },
        [RemoveCart.pending]: (state, action) => {
            return {...state, isLoading: true, message: null, error: null}
        },
        [RemoveCart.fulfilled]: (state, action) => {
            const {id} = action.payload;
            toast.success("Item Removed")
            return {
                isLoading: false, error: null, message: "Item removed", cart: state.cart.filter((cart) => {
                    return cart.ProductId._id !== id;
                }),
            }
        },
        [RemoveCart.rejected]: (state, action) => {
            return {isLoading: false, error: "Error while updating cart item", message: null, cart: state.cart}
        }
    }

})

export const {actions: CartActions, reducer: CartReducers} = CartSlice