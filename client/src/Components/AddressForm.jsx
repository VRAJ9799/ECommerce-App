import {Button, Col, Container, Form, FormGroup, FormLabel, Row} from "react-bootstrap";

export default function AddressForm({formik, activeStep, steps, handlePrevStep}) {
    return (
        <>
            <Container className={"w-75"}>
                <form onSubmit={formik.handleSubmit}>
                    <Row className={"justify-content-between"}>
                        <Col md={3}>
                            <FormGroup className={"mt-2"}>
                                <FormLabel>Name</FormLabel>
                                <Form.Control type={"text"} placeholder={"Name"} name={"name"} size={"sm"}
                                              value={formik.values.name} onChange={formik.handleChange}
                                              isInvalid={Boolean(formik.errors.name && formik.touched.name)}/>
                                <Form.Control.Feedback
                                    type={"invalid"}>{formik.errors.name}</Form.Control.Feedback>
                            </FormGroup>
                        </Col>
                        <Col md={3}>
                            <FormGroup className={"mt-2"}>
                                <FormLabel>Phone Number</FormLabel>
                                <Form.Control type={"text"} placeholder={"Phone Number"} name={"phone"}
                                              size={"sm"}
                                              value={formik.values.phone} onChange={formik.handleChange}
                                              isInvalid={Boolean(formik.errors.phone && formik.touched.phone)}/>
                                <Form.Control.Feedback
                                    type={"invalid"}>{formik.errors.phone}</Form.Control.Feedback>
                            </FormGroup>
                        </Col>
                        <Col md={3}>
                            <FormGroup className={"mt-2"}>
                                <FormLabel>Email</FormLabel>
                                <Form.Control type={"email"} placeholder={"Email"} name={"email"} size={"sm"}
                                              value={formik.values.email} onChange={formik.handleChange}
                                              isInvalid={Boolean(formik.errors.email && formik.touched.email)}/>
                                <Form.Control.Feedback
                                    type={"invalid"}>{formik.errors.email}</Form.Control.Feedback>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <FormGroup className={"mt-2"}>
                                <FormLabel>House No, Street Name</FormLabel>
                                <Form.Control type={"text"} placeholder={"House No, Street Name"} name={"line1"}
                                               size={"sm"} value={formik.values.line1}
                                              onChange={formik.handleChange}
                                              isInvalid={Boolean(formik.errors.line1 && formik.touched.line1)}
                                />
                                <Form.Control.Feedback type={"invalid"}>{formik.errors.line1}</Form.Control.Feedback>
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup className={"mt-2"}>
                                <FormLabel>Locality</FormLabel>
                                <Form.Control type={"text"} placeholder={"Locality"} name={"line2"}
                                              size={"sm"} value={formik.values.line2} onChange={formik.handleChange}
                                              isInvalid={Boolean(formik.errors.line2 && formik.touched.line2)}
                                />
                                <Form.Control.Feedback type={"invalid"}>{formik.errors.line1}</Form.Control.Feedback>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row className={"justify-content-between"}>
                        <Col md={3}>
                            <FormGroup className={"mt-2"}>
                                <FormLabel>Pin-Code</FormLabel>
                                <Form.Control type={"text"} placeholder={"Pin Code"} name={"postal_code"}
                                              size={"sm"} value={formik.values.postal_code}
                                              onChange={formik.handleChange}
                                              isInvalid={Boolean(formik.errors.postal_code && formik.touched.postal_code)}/>
                                <Form.Control.Feedback
                                    type={"invalid"}>{formik.errors.postal_code}</Form.Control.Feedback>
                            </FormGroup>
                        </Col>
                        <Col md={3}>
                            <FormGroup className={"mt-2"}>
                                <FormLabel>City</FormLabel>
                                <Form.Control type={"text"} placeholder={"City"} name={"city"}
                                              size={"sm"} value={formik.values.city} onChange={formik.handleChange}
                                              isInvalid={Boolean(formik.errors.city && formik.touched.city)}/>
                                <Form.Control.Feedback type={"invalid"}>{formik.errors.city}</Form.Control.Feedback>
                            </FormGroup>
                        </Col>
                        <Col md={3}>
                            <FormGroup className={"mt-2"}>
                                <FormLabel>State</FormLabel>
                                <Form.Control type={"text"} placeholder={"State"} name={"state"}
                                              size={"sm"} value={formik.values.state} onChange={formik.handleChange}
                                              isInvalid={Boolean(formik.errors.state && formik.touched.state)}/>
                                <Form.Control.Feedback type={"invalid"}>{formik.errors.state}</Form.Control.Feedback>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row className={"d-flex justify-content-end mt-5"}>
                        <Col md={4} sm={6} className={"d-flex justify-content-center"}>
                            <Button type={"submit"} disabled={activeStep === steps.length}
                                    className={"px-5"}
                                    variant={"primary"} size={"sm"}>Next</Button>
                        </Col>
                    </Row>
                </form>
            </Container>
        </>
    )
}