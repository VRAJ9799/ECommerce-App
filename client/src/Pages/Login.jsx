import * as Yup from "yup";
import {useFormik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import {AuthActions, LoginUser} from "../Reducers/AuthSlice"
import {useHistory} from "react-router-dom";
import {lazy, useEffect,Suspense} from "react";
import {Container, Row} from "react-bootstrap";
import {Toaster} from "react-hot-toast";
import Loading from "../Components/Loading";
const LoginForm = lazy(()=>import("../Components/LoginForm"));


export default function Login() {
    const dispatch = useDispatch();
    const history = useHistory();
    const {user} = useSelector(state => state.auth);
    useEffect(() => {
        if (user) history.push("/");
        return () => {
            dispatch(AuthActions.reset());
        }
    }, [user])
    const initialValues = {
        Email: "",
        Password: "",
    };
    const validationSchema = Yup.object().shape({
        Email: Yup.string().required("Email is Required").email("Invalid Email"),
        Password: Yup.string().required("Password is Required"),
    })
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: values => dispatch(LoginUser(values))
    })
    const {isLoading} = useSelector(state => state.auth);
    return (
        <>
            {isLoading ? <Loading/> :
                <Container className={"mt-5"}>
                    <Suspense fallback={<Loading/>}>
                        <LoginForm formik={formik}/>
                    </Suspense>
                    <Row>
                        <Toaster position={"bottom-center"} toastOptions={{duration: 3000}}/>
                    </Row>
                </Container>}
        </>
    )
}
