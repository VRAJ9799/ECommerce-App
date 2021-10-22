import {Button, Col, Form, FormGroup, FormLabel, Row} from "react-bootstrap";

export default function CreateProduct({formik, categories, setProductImage}) {
    const {values, errors, touched, handleChange} = formik;
    return (
        <>
            <Row className={"justify-content-center mt-1"}>
                <Col md={4}>
                    <h4 className={"text-center"}>New Product</h4>
                </Col>
            </Row>
            <form onSubmit={formik.handleSubmit}>
                <Row className={" my-3 justify-content-center"}>
                    <Col md={4}>
                        <FormGroup>
                            <FormLabel>Title</FormLabel>
                            <Form.Control type={"text"} name={"Title"} size={"sm"} placeholder={"Title"}
                                          value={values.Title}
                                          onChange={handleChange}
                                          isValid={Boolean(!errors.Title && touched.Title)}
                                          isInvalid={Boolean(errors.Title && touched.Title)}
                            />
                            <Form.Control.Feedback type={"invalid"}>{errors.Title}</Form.Control.Feedback>
                        </FormGroup>
                    </Col>
                    <Col md={3}>
                        <FormGroup>
                            <FormLabel>Category</FormLabel>
                            <Form.Select name={"Category"} size={"sm"} onChange={handleChange}
                                         isValid={Boolean(!errors.Category && touched.Category)}
                                         isInvalid={Boolean(errors.Category && touched.Category)}>
                                <option value={null}>Select Category</option>
                                {categories.map((category) => {
                                    return (
                                        <option value={category._id} key={category._id}>{category.Title}</option>
                                    )
                                })}
                            </Form.Select>
                            <Form.Control.Feedback type={"invalid"}>{errors.Category}</Form.Control.Feedback>
                        </FormGroup>
                    </Col>
                </Row>
                <Row className={" my-3 justify-content-center"}>
                    <Col md={7}>
                        <FormGroup>
                            <FormLabel>Description</FormLabel>
                            <Form.Control as={"textarea"} rows={5} size={"sm"} onChange={handleChange}
                                          value={values.Description} name={"Description"}
                                          isValid={Boolean(!errors.Description && touched.Description)}
                                          isInvalid={Boolean(errors.Description && touched.Description)}/>
                            <Form.Control.Feedback type={"invalid"}>{errors.Description}</Form.Control.Feedback>
                        </FormGroup>
                    </Col>
                </Row>
                <Row className={"my-3 justify-content-center"}>
                    <Col md={3}>
                        <FormGroup>
                            <FormLabel>Author</FormLabel>
                            <Form.Control type={"text"} name={"Author"} placeholder={"Author"} size={"sm"}
                                          onChange={handleChange}
                                          value={values.Author}
                                          isValid={Boolean(!errors.Author && touched.Author)}
                                          isInvalid={Boolean(errors.Author && touched.Author)}/>
                            <Form.Control.Feedback type={"invalid"}>{errors.Author}</Form.Control.Feedback>
                        </FormGroup>
                    </Col>
                    <Col md={2}>
                        <FormGroup>
                            <FormLabel>Price</FormLabel>
                            <Form.Control type={"number"} name={"Price"} placeholder={"Price"} size={"sm"}
                                          onChange={handleChange}
                                          value={values.Price}
                                          isValid={Boolean(!errors.Price && touched.Price)}
                                          isInvalid={Boolean(errors.Price && touched.Price)}/>
                            <Form.Control.Feedback type={"invalid"}>{errors.Price}</Form.Control.Feedback>
                        </FormGroup>
                    </Col>
                    <Col md={2}>
                        <FormGroup>
                            <FormLabel>Quantity</FormLabel>
                            <Form.Control type={"number"} name={"Quantity"} placeholder={"Quantity"}
                                          size={"sm"}
                                          onChange={handleChange}
                                          value={values.Quantity}
                                          isValid={Boolean(!errors.Quantity && touched.Quantity)}
                                          isInvalid={Boolean(errors.Quantity && touched.Quantity)}
                            />
                            <Form.Control.Feedback type={"invalid"}>{errors.Quantity}</Form.Control.Feedback>
                        </FormGroup>
                    </Col>
                </Row>
                <Row className={"justify-content-center"}>
                    <Col md={7}>
                        <FormGroup>
                            <FormLabel>Product Image</FormLabel>
                            <br/>
                            <Form.Control type={"file"} name={"ProductImage"} accept={".jpg,.jpeg,.png,.webp"}
                                          required={true}
                                          size={"sm"} onChange={({target}) => {
                                const {files} = target;
                                if (files.length > 0) setProductImage(files[0])
                            }}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row className={"mt-4 justify-content-end"}>
                    <Col md={4}>
                        <Button type={"submit"} variant={"success"} className={"px-5"}>Create</Button>
                    </Col>
                </Row>
            </form>
        </>
    )
}