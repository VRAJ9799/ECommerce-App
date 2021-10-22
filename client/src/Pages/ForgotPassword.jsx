import {
  Button,
  Col,
  Container,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
  Spinner,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import API from "../Utils/API";

export default function ForgotPassword() {
  const [email, setEmail] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (error !== null) {
      setTimeout(() => setError(null), 5000);
    }
    if (message !== null) {
      setTimeout(() => setMessage(null), 5000);
    }
  }, [error, message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await API({
        method: "put",
        url: "user/forgot-password",
        data: { Email: email },
      });
      const message = response?.data?.message;
      setMessage(message);
    } catch (error) {
      setError(error?.response?.data.error);
    }
    setLoading(false);
  };
  return (
    <>
      <Container className={"ustify-content-center mt-3"}>
        <Row>
          <h5 className="text-center">Forgot Password</h5>
        </Row>
        <Row className="d-flex justify-content-center">
          <Col xs={10} md={4} sm={6}>
            <Form onSubmit={(e) => handleSubmit(e)} className={"mb-5"}>
              <FormGroup className={"my-3"}>
                <FormLabel htmlFor={"Email"}>Email</FormLabel>
                <FormControl
                  type={"email"}
                  name={"Email"}
                  placeholder={"Email"}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormGroup>
              <Button
                type={"submit"}
                variant={"primary"}
                disabled={Boolean(loading)}
              >
                {loading
                  ? (
                      <Spinner
                        as={"span"}
                        animation={"border"}
                        size={"sm"}
                        role={"status"}
                        aria-hidden={true}
                      />
                    ) + "Please wait.."
                  : "Submit"}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}
