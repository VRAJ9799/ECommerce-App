import {Redirect, Route} from "react-router-dom";

export function PrivateRoute({isAuth, component: Component, ...rest}) {
    return (
        <>
            <Route {...rest} render={(props) =>
                isAuth ? <Component {...props} /> : <Redirect to={{pathname: "/login"}}/>
            }/>
        </>

    )
}

export function AdminRoute({isAuth, role, component: Component, ...rest}) {
    return (
        <>
            <Route {...rest} render={(props) =>
                isAuth & role === 'Admin' ? <Component {...props} /> : <Redirect to={{pathname: "/login"}}/>
            }/>
        </>
    )
}