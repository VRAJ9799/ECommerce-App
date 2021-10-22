import {Button, Col, Form, FormGroup, FormLabel, Row} from "react-bootstrap";
import {Link} from "react-router-dom";

export default function SignUpForm(props) {
    const {values, errors, touched, handleChange, handleSubmit} = props.formik;
    return (
        <>
            <form onSubmit={handleSubmit}>
                <Row className={"d-flex flex-column justify-content-center align-items-center"}>
                    <Col md={3}>
                        <h5 className={"text-center"}>Sign Up</h5>
                    </Col>
                    <Col md={4} sm={6}>
                        <FormGroup className={"mt-2"}>
                            <FormLabel htmlFor={"Name"}>Name</FormLabel>
                            <Form.Control type={"text"} name={"Name"} placeholder={"Name"} value={values.Name}
                                          onChange={handleChange} required
                                          size={"sm"} isInvalid={Boolean(errors.Name && touched.Name)}
                                          isValid={Boolean(!errors.Name && touched.Name)}/>
                            <Form.Control.Feedback type={"invalid"}>{errors.Name}</Form.Control.Feedback>
                        </FormGroup>
                    </Col>
                    <Col md={4} sm={6}>
                        <FormGroup className={"mt-2"}>
                            <FormLabel htmlFor={"Email"}>Email</FormLabel>
                            <Form.Control type={"email"} name={"Email"} placeholder={"Email"} value={values.Email}
                                          onChange={handleChange}
                                          size={"sm"} isInvalid={Boolean(errors.Email && touched.Email)}
                                          isValid={Boolean(!errors.Email && touched.Email)}/>
                            <Form.Control.Feedback type={"invalid"}>{errors.Email}</Form.Control.Feedback>
                        </FormGroup>
                    </Col>
                    <Col md={4} sm={6}>
                        <FormGroup className={"mt-2"}>
                            <FormLabel htmlFor={"PhoneNumber"}>Phone Number</FormLabel>
                            <Form.Control type={"text"} name={"PhoneNumber"} placeholder={"Phone Number"}
                                          value={values.PhoneNumber} onChange={handleChange}
                                          size={"sm"} isInvalid={Boolean(errors.PhoneNumber && touched.PhoneNumber)}
                                          isValid={Boolean(!errors.PhoneNumber && touched.PhoneNumber)}/>
                            <Form.Control.Feedback type={"invalid"}>{errors.PhoneNumber}</Form.Control.Feedback>
                        </FormGroup>
                    </Col>
                    <Col md={4} sm={6}>
                        <FormGroup className={"mt-2"}>
                            <FormLabel htmlFor={"Password"}>Password</FormLabel>
                            <Form.Control type={"password"} name={"Password"} placeholder={"Password"}
                                          value={values.Password} onChange={handleChange}
                                          size={"sm"} isInvalid={Boolean(errors.Password && touched.Password)}
                                          isValid={Boolean(!errors.Password && touched.Password)}/>
                            <Form.Control.Feedback type={"invalid"}>{errors.Password}</Form.Control.Feedback>
                        </FormGroup>
                    </Col>
                    <Col md={4} sm={6}>
                        <FormGroup className={"mt-2"}>
                            <FormLabel htmlFor={"ConfirmPassword"}>Confirm Password</FormLabel>
                            <Form.Control type={"password"} name={"ConfirmPassword"} placeholder={"Confirm Password"}
                                          value={values.ConfirmPassword} onChange={handleChange}
                                          size={"sm"}
                                          isInvalid={Boolean(errors.ConfirmPassword && touched.ConfirmPassword)}
                                          isValid={Boolean(!errors.ConfirmPassword && touched.ConfirmPassword)}/>
                            <Form.Control.Feedback type={"invalid"}>{errors.ConfirmPassword}</Form.Control.Feedback>
                        </FormGroup>
                    </Col>
                    <Col md={4} sm={6} className={"mt-3 d-grid"}>
                        <Button type={"submit"} size={"sm"}>Sign Up</Button>
                    </Col>
                    <Col md={4} sm={6} className={"mt-3"}>
                        Already having an account? <Link to={"/login"} className={"text-decoration-none"}>Login Here</Link>
                    </Col>
                </Row>
            </form>

        </>
    )
}