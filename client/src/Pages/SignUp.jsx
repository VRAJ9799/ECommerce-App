import * as Yup from "yup";
import {useFormik} from "formik";
import SignUpForm from "../Components/SignUpForm";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {useHistory} from "react-router-dom";
import Loading from "../Components/Loading";
import {AuthActions, LoginUser} from "../Reducers/AuthSlice";
import {toast, Toaster} from "react-hot-toast";
import API from "../Utils/API";
import {Container, Row} from "react-bootstrap";


export default function SignUp() {
    const dispatch = useDispatch();
    const initialValues = {
        Name: "",
        Email: "",
        PhoneNumber: "",
        Password: "",
        ConfirmPassword: ""
    };
    const validationSchema = Yup.object().shape({
        Name: Yup.string().required("Name is Required").matches(/^[a-zA-Z ]+$/, "Should Only contain Alphabets and space"),
        Email: Yup.string().required("Email is Required").email("Invalid Email"),
        PhoneNumber: Yup.string().required("PhoneNumber is Required").matches(/^\d{10}$/, {message: "Should contain only 10 digits"}),
        Password: Yup.string().required("Password is Required"),
        ConfirmPassword: Yup.string().required("Confirm Password is Required").oneOf([Yup.ref("Password")], "Confirm Password and Password are not same")
    })
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: values => handleRegister(values)
    })
    const history = useHistory();
    const {isLoading, user} = useSelector(state => state.auth);
    useEffect(() => {
        if (user) {
            history.push("/");
        }
        return () => {
            dispatch(AuthActions.reset());
        }
    }, [user])
    const handleRegister = async (values) => {
        try {
            await API({method: "post", url: "auth/register", data: values})
            dispatch(LoginUser({Email: values.Email, Password: values.Password}));
        } catch (error) {
            toast.error(error?.response?.data?.error);
        }
    }
    return (
        <>
            {isLoading ? <Loading/> :
                <Container className={"mt-3"}>
                    <SignUpForm formik={formik}/>
                    <Row>
                        <Toaster position={"bottom-center"} toastOptions={{duration: 3000}}/>
                    </Row>
                </Container>
            }
        </>
    )
}
