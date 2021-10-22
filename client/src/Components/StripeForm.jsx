import {Button, Col, Container, Form, FormGroup, FormLabel, Row} from "react-bootstrap";
import {CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe} from "@stripe/react-stripe-js";
import {toast} from "react-hot-toast";

export default function StripeForm({
                                       paymentMethod,
                                       setPaymentMethod,
                                       totalAmount,
                                       handlePayment,
                                       loading,
                                       setLoading,
                                       shippingDetails
                                   }) {
    const stripe = useStripe();
    const elements = useElements();
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        const {error, paymentMethod} = await stripe.createPaymentMethod({
            card: elements.getElement(CardNumberElement),
            type: "card",
            billing_details: {
                name: shippingDetails.name,
                address: {
                    line1: shippingDetails.line1,
                    line2: shippingDetails.line2,
                    postal_code: shippingDetails.postal_code,
                    city: shippingDetails.city,
                    country: "IN",
                    state: shippingDetails.state
                },
                email: shippingDetails.email,
                phone: shippingDetails.phone
            }
        });
        if (error) {
            toast.error(error.message);
        } else {
            const {id, billing_details} = paymentMethod;
            // const details = {
            //     line1: billing_details.address.line1,
            //     line2: billing_details.address.line2,
            //     city: billing_details.address.city,
            //     state: billing_details.address.line1,
            //     country: billing_details.address.line1,
            //     postal_code: billing_details.address.line1,
            //     email: billing_details.email,
            //     phone: billing_details.phone,
            //     name: billing_details.name
            // };
            // const {address: {line1, line2, postal_code, city, country, state}, name, email, phone} = billing_details;
            handlePayment(id);
        }
    };
    return (
        <>
            <Container className={"w-75"}>
                <Row>
                    <Col>
                        <h6>Payment Method</h6>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormGroup className={"mt-2"}>
                            <Form.Check name={"COD"} value={"Cash On Delivery"}
                                        checked={Boolean(paymentMethod === 'COD')}
                                        label={"Cash On Delivery"} onChange={(event) => setPaymentMethod('COD')
                            }/>
                        </FormGroup>
                        <FormGroup className={"mt-2"}>
                            <Form.Check name={"Card"} value={"Card"} checked={Boolean(paymentMethod === 'Card')}
                                        label={"Card"} onChange={(event) =>
                                setPaymentMethod("Card")}/>
                        </FormGroup>
                        {paymentMethod === 'COD' ? <div>
                            <Row className={"justify-content-center mt-4"}>
                                <Col md={4} className={"d-grid gap-2"}>
                                    <Button size={"md"} variant={"primary"} disabled={loading}
                                            onClick={() => {
                                                setLoading(true)
                                                handlePayment(null)
                                            }}
                                            type="button">Pay &#8377; {Math.abs(totalAmount).toFixed(2)} </Button>
                                </Col>
                            </Row>
                        </div> : ""}
                        {paymentMethod === 'Card' ?
                            <div>
                                <form onSubmit={handleSubmit}>
                                    <Row className={"justify-content-center"}>
                                        <Col md={4}>
                                            <FormGroup className={"mt-2"}>
                                                <FormLabel>Card Number</FormLabel>
                                                <CardNumberElement
                                                    options={{
                                                        classes: {
                                                            base: "form-control form-control-sm"
                                                        },
                                                        style: {
                                                            base: {
                                                                fontSize: "16px",
                                                                color: "#424770",
                                                                letterSpacing: "0.025em",
                                                                fontFamily: "Source Code Pro, monospace",
                                                                "::placeholder": {
                                                                    color: "#aab7c4",
                                                                },
                                                            },
                                                            invalid: {
                                                                color: "#9e2146",
                                                            },
                                                        },
                                                    }}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row className={"justify-content-center"}>
                                        <Col md={2}>
                                            <FormGroup className={"mt-2"}>
                                                <FormLabel>Expiry Date</FormLabel>
                                                <CardExpiryElement
                                                    options={{
                                                        classes: {
                                                            base: "form-control form-control-sm"
                                                        },
                                                        style: {
                                                            base: {
                                                                fontSize: "16px",
                                                                color: "#424770",
                                                                letterSpacing: "0.025em",
                                                                fontFamily: "Source Code Pro, monospace",
                                                                "::placeholder": {
                                                                    color: "#aab7c4",
                                                                },
                                                            },
                                                            invalid: {
                                                                color: "#9e2146",
                                                            },
                                                        },
                                                    }}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={2}>
                                            <FormGroup className={"mt-2"}>
                                                <FormLabel>CVV</FormLabel>
                                                <CardCvcElement
                                                    options={{
                                                        classes: {
                                                            base: "form-control form-control-sm"
                                                        },
                                                        style: {
                                                            base: {
                                                                fontSize: "16px",
                                                                color: "#424770",
                                                                letterSpacing: "0.025em",
                                                                fontFamily: "Source Code Pro, monospace",
                                                                "::placeholder": {
                                                                    color: "#aab7c4",
                                                                },
                                                            },
                                                            invalid: {
                                                                color: "#9e2146",
                                                            },
                                                        },
                                                    }}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row className={"justify-content-center mt-4"}>
                                        <Col md={4} className={"d-grid gap-2"}>
                                            <Button size={"md"} variant={"primary"} size={"md"}
                                                    disabled={loading}
                                                    type="submit">Pay &#8377; {Math.abs(totalAmount).toFixed(2)} </Button>
                                        </Col>
                                    </Row>
                                </form>
                            </div>
                            : ""
                        }
                    </Col>
                </Row>
            </Container>

        </>
    );
}