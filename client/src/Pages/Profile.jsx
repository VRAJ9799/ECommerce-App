import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {Button, Col, Container, Form, FormGroup, FormLabel, Row} from "react-bootstrap";
import {useRef, useState} from "react";
import {useFormik} from "formik";
import * as Yup from "yup";
import {BsUpload} from "react-icons/all";
import API from "../Utils/API";
import {toast} from "react-hot-toast";
import {AuthActions} from "../Reducers/AuthSlice";
import Loading from "../Components/Loading";

export default function Profile() {
    const dispatch = useDispatch();
    const history = useHistory();
    const {user, isLoading} = useSelector(state => state.auth);
    const [read, setRead] = useState(true);
    const [loading, setLoading] = useState(false);
    const [ProfileImage, setProfileImage] = useState(null);
    const initialValues = {
        Name: user?.Name,
        Email: user?.Email,
        PhoneNumber: user?.PhoneNo,
        Password: "",
        ConfirmPassword: ""
    }
    const validationSchema = Yup.object().shape({
        Name: Yup.string().required("Name is Required").matches(/^[a-zA-Z ]+$/, "Should Only contain Alphabets and space"),
        PhoneNumber: Yup.string().required("PhoneNumber is Required").matches(/^\d{10}$/, {message: "Should contain only 10 digits"}),
        Password: Yup.string().required("Password is Required"),
        ConfirmPassword: Yup.string().required("Confirm Password is Required").oneOf([Yup.ref("Password")], "Confirm Password and Password are not same")
    })
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: values => {
            handleProfileChange(values);
        }
    })
    const handleProfileChange = (values) => {
        setLoading(true);
        const formdata = new FormData();
        formdata.append("ProfileImage", ProfileImage);
        formdata.append("Name", values.Name);
        formdata.append("PhoneNumber", values.PhoneNumber);
        formdata.append("Password", values.Password);
        API({
            method: "PUT",
            url: "user/update-profile",
            headers: {"content-type": "multipart/form-data"},
            data: formdata,
            privateRoute: true
        })
            .then(response => {
                const {message, user} = response?.data;
                toast.success(message);
                dispatch(AuthActions.handleChangeProfile({user}));
            })
            .catch(error => {
                toast.error(error?.response?.data.error);
                history.push("/")
            })
        setRead(false);
        setLoading(false);
    }
    const {values, errors, touched, handleChange, handleSubmit} = formik;
    const file = useRef();
    return (
        <>
            {loading ? <Loading/> :
                <Container className={"mt-3"}>
                    <form onSubmit={handleSubmit}>
                        <Row className={"justify-content-center"}>
                            <Col md={4} className={"d-flex justify-content-center"}>
                                <img
                                    style={{borderRadius: "50%", overflow: "hidden"}}
                                    src={ProfileImage ? URL.createObjectURL(ProfileImage) : user?.ProfilePhoto}
                                    alt={user?.Name} height={100} width={100}/>
                                <input type={"file"} name={"ProfileImage"} ref={file} accept={".jpg,.jpeg,.png,.webp"}
                                       onChange={e => {
                                           if (e.target.files.length > 0) {
                                               setProfileImage(e.target.files[0]);
                                           }
                                       }}
                                       hidden/>
                                <span className={"position-relative"} style={{top: 80}}>
                            <BsUpload
                                onClick={() => file.current.click()} style={{cursor: "pointer"}}/>
                            </span>
                            </Col>
                        </Row>
                        <Row className={"justify-content-center"}>
                            <Col md={4}>
                                <FormGroup className={"mt-2"}>
                                    <FormLabel htmlFor={"Name"}>Name</FormLabel>
                                    <Form.Control type={"text"} name={"Name"} placeholder={"Name"} value={values.Name}
                                                  onChange={handleChange} required readOnly={read}
                                                  size={"sm"} isInvalid={Boolean(errors.Name && touched.Name)}
                                                  isValid={Boolean(!errors.Name && touched.Name)}/>
                                    <Form.Control.Feedback type={"invalid"}>{errors.Name}</Form.Control.Feedback>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className={"justify-content-center"}>
                            <Col md={4}>
                                <FormGroup className={"mt-2"}>
                                    <FormLabel htmlFor={"Email"}>Email</FormLabel>
                                    <Form.Control type={"email"} size={"sm"} name={"Email"} value={values.Email}
                                                  readOnly={true}/>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className={"justify-content-center"}>
                            <Col md={4}>
                                <FormGroup className={"mt-2"}>
                                    <FormLabel htmlFor={"PhoneNumber"}>Phone Number</FormLabel>
                                    <Form.Control type={"text"} name={"PhoneNumber"} placeholder={"PhoneNumber"}
                                                  value={values.PhoneNumber} onChange={handleChange} required
                                                  readOnly={read}
                                                  size={"sm"}
                                                  isInvalid={Boolean(errors.PhoneNumber && touched.PhoneNumber)}
                                                  isValid={Boolean(!errors.PhoneNumber && touched.PhoneNumber)}/>
                                    <Form.Control.Feedback type={"invalid"}>{errors.PhoneNumber}</Form.Control.Feedback>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className={"justify-content-center"}>
                            <Col md={4}>
                                <FormGroup className={"mt-2"}>
                                    <FormLabel htmlFor={"Password"}>Password</FormLabel>
                                    <Form.Control type={"password"} name={"Password"} placeholder={"Password"}
                                                  value={values.Password} onChange={handleChange} readOnly={read}
                                                  size={"sm"} isInvalid={Boolean(errors.Password && touched.Password)}
                                                  isValid={Boolean(!errors.Password && touched.Password)}/>
                                    <Form.Control.Feedback type={"invalid"}>{errors.Password}</Form.Control.Feedback>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className={"justify-content-center"}>
                            <Col md={4}>
                                <FormGroup className={"mt-2"}>
                                    <FormLabel htmlFor={"ConfirmPassword"}>Confirm Password</FormLabel>
                                    <Form.Control type={"password"} name={"ConfirmPassword"}
                                                  placeholder={"Confirm Password"} value={values.ConfirmPassword}
                                                  onChange={handleChange} readOnly={read}
                                                  size={"sm"}
                                                  isInvalid={Boolean(errors.ConfirmPassword && touched.ConfirmPassword)}
                                                  isValid={Boolean(!errors.ConfirmPassword && touched.ConfirmPassword)}/>
                                    <Form.Control.Feedback
                                        type={"invalid"}>{errors.ConfirmPassword}</Form.Control.Feedback>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className={"mt-5 justify-content-center"}>
                            {read ?
                                <>
                                    <Col md={4} className={"d-flex justify-content-end"}>
                                        <Button type={"button"} size={"sm"} variant={"secondary"} className={"px-5"}
                                                onClick={() => setRead(false)}>Edit</Button>
                                    </Col>
                                </>
                                :
                                <>
                                    <Col md={2} className={"d-flex justify-content-around"}>
                                        <Button type={"submit"} size={"sm"} variant={"success"} className={"px-5"}
                                        >Update</Button>
                                    </Col>
                                    <Col md={2} className={"d-flex justify-content-around"}>
                                        <Button type={"button"} size={"sm"} variant={"secondary"} className={"px-5"}
                                                onClick={() => setRead(true)}>Cancel</Button>
                                    </Col>
                                </>
                            }
                        </Row>
                    </form>
                </Container>
            }
        </>
    )
}
