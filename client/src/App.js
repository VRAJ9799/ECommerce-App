import Header from "./Components/Header";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import HomePage from "./Pages/HomePage";
import ProductDetail from "./Pages/ProductDetail";
import Cart from "./Pages/Cart";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import Footer from "./Components/Footer";
import ForgotPassword from "./Pages/ForgotPassword";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {AuthActions} from "./Reducers/AuthSlice";
import Checkout from "./Pages/Checkout";
import OrderList from "./Pages/OrderList";
import Profile from "./Pages/Profile";
import Users from "./Pages/Users";
import SingleUser from "./Pages/SingleUser";
import ResetPassword from "./Pages/ResetPassword";
import {AdminRoute, PrivateRoute} from "./PrivateRoute";
import MyOrders from "./Pages/MyOrders";
import OrderDetail from "./Pages/OrderDetail";
import NewProduct from "./Pages/NewProduct";

function App() {
    const dispatch = useDispatch();
    const {user, token, isLoggedIn} = useSelector(state => state.auth);
    useEffect(() => {
        let user = JSON.parse(sessionStorage.getItem("user"));
        let token = sessionStorage.getItem("token");
        if (user && token) {
            dispatch(AuthActions.alreadyLoggedIn({user, token}));
        }
    }, [])
    useEffect(() => {
        if (user && token) {
            sessionStorage.setItem("user", JSON.stringify(user));
            sessionStorage.setItem("token", token)
        }
    }, [user, token])
    const handleLogOut = () => {
        dispatch(AuthActions.logOut());
    }
    return (
        <div style={{minHeight: "100vh", display: "flex", flexDirection: "column"}}>
            <BrowserRouter>
                <Header handleLogOut={handleLogOut}/>
                <div className={"mb-5"}>
                    <Switch>
                        {/*User*/}
                        <Route exact path={"/sign-up"} component={SignUp}/>
                        <Route exact path={"/login"} component={Login}/>
                        <Route exact path={"/forgot-password"} component={ForgotPassword}/>
                        <Route exact path={"/reset-password/:token"} component={ResetPassword}/>
                        {/*Product*/}
                        <Route exact path={"/"} component={HomePage}/>
                        <Route exact path={"/product/:id"} component={ProductDetail}/>
                        <Route exact path={"/order/:id"} component={OrderDetail}/>
                        {/*User*/}
                        <PrivateRoute isAuth={isLoggedIn} exact path={"/profile"} component={Profile}/>
                        <PrivateRoute isAuth={isLoggedIn} exact path={"/cart"} component={Cart}/>
                        <PrivateRoute isAuth={isLoggedIn} exact path={"/checkout"} component={Checkout}/>
                        <PrivateRoute isAuth={isLoggedIn} exact path={"/orders"} component={MyOrders}/>
                        {/*Admin*/}
                        <AdminRoute isAuth={isLoggedIn} role={user?.Role} exact path={"/users"} component={Users}/>
                        <AdminRoute isAuth={isLoggedIn} role={user?.Role} exact path={"/user/:id"}
                                    component={SingleUser}/>
                        <AdminRoute isAuth={isLoggedIn} role={user?.Role} exact path={"/admin-orders"}
                                    component={OrderList}/>
                        <AdminRoute isAuth={isLoggedIn} role={user?.Role} exact path={"/addProduct"} component={NewProduct}/>
                        <Route path={'*'} component={()=><h1>404 Not Found</h1>}/>
                    </Switch>
                </div>
                <Footer/>
            </BrowserRouter>
        </div>
    );
}

export default App;
