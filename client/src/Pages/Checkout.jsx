import { Button, Col, Container, Row } from "react-bootstrap";
import { lazy, Suspense, useEffect, useState } from "react";
import { Step, StepLabel, Stepper } from "@material-ui/core";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js/pure";
import { toast, Toaster } from "react-hot-toast";
import API from "../Utils/API";
import { useHistory } from "react-router-dom";
import Loading from "../Components/Loading";

const AddressForm = lazy(() => import("../Components/AddressForm"));
const CartSummary = lazy(() => import("../Components/CartSummary"));
const StripeForm = lazy(() => import("../Components/StripeForm"));

export default function Checkout() {
  const { user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Select Delivery Address", "Summary", "Payment"];
  const [shippingDetails, setShippingDetails] = useState(null);
  const [cartAmount, setCartAmount] = useState(
    cart.reduce(
      (sum, item) => (sum += item.QuantityPurchased * item.ProductId.Price),
      0
    )
  );
  const [tax, setTax] = useState(0);
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  useEffect(() => {
    setCartAmount(
      cart.reduce(
        (sum, item) => (sum += item.QuantityPurchased * item.ProductId.Price),
        0
      )
    );
    setDeliveryCharges(cartAmount > 500 ? 0 : 100);
    setTax(cartAmount * 0.05);
    setTotalAmount(Number(cartAmount) + Number(tax) + Number(deliveryCharges));
  }, [cartAmount, tax, deliveryCharges, cart]);
  const initialValues = {
    name: user?.Name || "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    country: "IN",
    postal_code: "",
    phone: user?.PhoneNo || "",
    email: user?.Email || "",
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is Required"),
    email: Yup.string().required("Email is Required").email("Invalid Email"),
    line1: Yup.string().required("Address Line 1 is Required"),
    line2: Yup.string(),
    city: Yup.string().required("City is Required"),
    state: Yup.string().required("Name is Required"),
    postal_code: Yup.string()
      .required("Postal Code is Required")
      .matches(/^\d{6}$/, { message: "Invalid Pin Code" }),
    phone: Yup.string()
      .required("Phone Number is Required")
      .matches(/^\d{10}$/, { message: "Should be 10 digit only" }),
  });
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      setShippingDetails(values);
      handleNextStep();
    },
  });
  const handlePrevStep = () => {
    setActiveStep((prevData) => prevData - 1);
  };
  const handleNextStep = () => {
    setActiveStep((prevData) => prevData + 1);
  };
  const handlePayment = async (id) => {
    try {
      let data = {
        PaymentMethod: paymentMethod,
        Amount: totalAmount * 100,
        ShippingDetails: shippingDetails,
      };
      if (id) data["Payment_Id"] = id;
      const response = await API({
        method: "POST",
        url: "order/place",
        data,
        privateRoute: true,
      });
      if (paymentMethod === "COD") {
        const { message } = response?.data;
        toast.success(message);
        history.push("/orders");
      } else {
        const { status, next_action, message } = response?.data;
        if (status === "succeeded") {
          toast.success(message);
          history.push("/orders");
        } else if (next_action != null) {
          const { type } = next_action;
          switch (type) {
            case "redirect_to_url":
              window.open(next_action.redirect_to_url_url, "_blank");
              break;
            case "use_stripe_sdk":
              const url = next_action?.use_stripe_sdk?.stripe_js;
              window.open(url, "_blank");
              break;
            case "requires_payment_method":
              toast.error("Payment Failed Please try again");
              history.push("/orders");
              break;
          }
        }
      }
    } catch (error) {
      toast.error(error?.response?.data.error);
      history.push("/");
    }
    setLoading(false);
  };
  const stripePromise = loadStripe(
    process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
  );
  return (
    <>
      <Container className={"mt-3"}>
        <Row>
          <Col md={4}>
            <Button
              variant={"outline-secondary custom-button"}
              className={"py-1 px-2"}
              onClick={() => history.goBack()}
            >
              Go Back
            </Button>
          </Col>
        </Row>
        <Row>
          <Col className={"justify-content-center"}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((stepLabel) => {
                return (
                  <Step key={stepLabel}>
                    <StepLabel>{stepLabel}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
          </Col>
          <Col md={12}>
            {activeStep === 0 ? (
              <Suspense fallback={<Loading />}>
                <AddressForm
                  formik={formik}
                  activeStep={activeStep}
                  steps={steps}
                  handlePrevStep={handlePrevStep}
                />
              </Suspense>
            ) : (
              ""
            )}
            {activeStep === 1 ? (
              <Suspense fallback={<Loading />}>
                <CartSummary
                  cart={cart}
                  cartAmount={cartAmount}
                  tax={tax}
                  deliveryCharges={deliveryCharges}
                  handlePrevStep={handlePrevStep}
                  activeStep={activeStep}
                  steps={steps}
                  handleNextStep={handleNextStep}
                  shippingDetails={shippingDetails}
                  totalAmount={totalAmount}
                />
              </Suspense>
            ) : (
              ""
            )}
            {activeStep === 2 ? (
              <Container>
                <Suspense fallback={<Loading />}>
                  <Elements stripe={stripePromise}>
                    <StripeForm
                      paymentMethod={paymentMethod}
                      shippingDetails={shippingDetails}
                      setPaymentMethod={setPaymentMethod}
                      totalAmount={totalAmount}
                      handlePayment={handlePayment}
                      loading={loading}
                      setLoading={setLoading}
                    />
                  </Elements>
                </Suspense>
              </Container>
            ) : (
              ""
            )}
          </Col>
        </Row>
        <Row>
          <Toaster
            position={"bottom-center"}
            toastOptions={{ duration: 5000 }}
          />
        </Row>
      </Container>
    </>
  );
}
