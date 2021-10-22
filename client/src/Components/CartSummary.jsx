import {Button, Col, Container, Row} from "react-bootstrap";

export default function CartSummary({
                                        cart,
                                        cartAmount,
                                        tax,
                                        deliveryCharges,
                                        shippingDetails,
                                        handlePrevStep,
                                        handleNextStep,
                                        totalAmount,
                                        steps,
                                        activeStep
                                    }) {
    return (
        <>
            <Container>
                {cart.map((item) => {
                    return (
                        <>
                            <Row>
                                <Col xs={2} md={2}>
                                    <img src={item.ProductId.Image} height={80} alt={item.ProductId.Title}
                                         className={"d-block mx-auto my-2"}/>
                                </Col>
                                <Col xs={10} md={10}>
                                    <Row>
                                        <Col>
                                            <p className={"fs-5"}>{item.ProductId.Title}</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={6} md={6}>
                                            <p className={"fs-6 fw-bold"}>Quantity:{item.QuantityPurchased}</p>
                                        </Col>
                                        <Col xs={6} md={4} className={"d-flex justify-content-end p-0"}>
                                            <p className={"fs-6 fw-bold text-right"}>{Math.abs(item.QuantityPurchased * item.ProductId.Price).toFixed(2)}</p>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </>
                    )
                })}
                <Row style={{borderTop: "1px solid #e0e0e0"}} className={"pt-2"}>
                    <Col md={8} xs={2}></Col>
                    <Col md={4} xs={10} className={"d-flex justify-content-md-center justify-content-end p-0"}>
                        <h6>&#8377; {Math.abs(cartAmount).toFixed(2)}</h6>
                    </Col>
                </Row>
                <Row>
                    <Col md={8} xs={2}>Tax</Col>
                    <Col md={4} xs={10} className={"d-flex justify-content-md-center justify-content-end p-0"}>
                        <h6>&#8377; {Math.abs(tax).toFixed(2)}</h6>
                    </Col>
                </Row>
                <Row >
                    <Col md={8} xs={6}>Shipping Charges</Col>
                    <Col md={4} xs={6} className={"d-flex justify-content-md-center justify-content-end p-0"}>
                        <h6>&#8377; {Math.abs(deliveryCharges).toFixed(2)}</h6>
                    </Col>
                </Row>
                <Row >
                    <Col md={8} xs={6}>Total Amount</Col>
                    <Col md={4} xs={6} className={"d-flex justify-content-md-center justify-content-end p-0"}>
                        <h6>&#8377; {Math.abs(totalAmount).toFixed(2)}</h6>
                    </Col>
                </Row>
                {shippingDetails ?
                    <Row style={{borderTop: "1px solid #e0e0e0"}} className={"justify-content-start pt-2"}>
                        <Col md={12}>
                            <p className={"pb-0 mb-0"}>Deliver To</p>
                        </Col>
                        <Col md={6}>
                            <p style={{fontSize: "0.9rem"}}>{shippingDetails?.name}<br/>{shippingDetails?.line1},{shippingDetails?.line2}, {shippingDetails?.city}, {shippingDetails?.state}<br/>
                                {shippingDetails?.postal_code}
                                <br/>Phone No: {shippingDetails?.phone}
                            </p>
                        </Col>
                    </Row> : ""
                }
                <Row className={"mt-5 justify-content-around"}>
                    <Col md={4} xs={6}>
                        <Button disabled={activeStep === 0} onClick={() => handlePrevStep()}
                                className={"px-5"}
                                variant={"secondary"} size={"sm"}>Back</Button>
                    </Col>
                    <Col md={4} xs={6} className={"justify-content-end d-flex"}>
                        <Button type={"submit"} disabled={activeStep === steps.length} onClick={() => handleNextStep()}
                                className={"px-5"}
                                variant={"primary"} size={"sm"}>Next</Button>
                    </Col>
                </Row>
            </Container>
        </>
    )
}