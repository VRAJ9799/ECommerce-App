import { Button, Col, Form, FormGroup, FormLabel, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function LoginForm(props) {
  const { values, errors, touched, handleChange, handleSubmit, handleBlur } =
    props.formik;
  return (
    <>
      <form onSubmit={handleSubmit}>
        <Row
          className={
            "d-flex flex-column justify-content-center align-items-center"
          }
        >
          <Col md={3}>
            <h5 className={"text-center"}>Log In</h5>
          </Col>
          <Col md={4} sm={6}>
            <FormGroup className={"mt-2"}>
              <FormLabel htmlFor={"Email"}>Email</FormLabel>
              <Form.Control
                type={"email"}
                name={"Email"}
                placeholder={"Email"}
                value={values.Email}
                onChange={handleChange}
                size={"sm"}
                isInvalid={Boolean(errors.Email && touched.Email)}
                isValid={Boolean(!errors.Email && touched.Email)}
              />
              <Form.Control.Feedback type={"invalid"}>
                {errors.Email}
              </Form.Control.Feedback>
            </FormGroup>
          </Col>

          <Col md={4} sm={6}>
            <FormGroup className={"mt-2"}>
              <FormLabel htmlFor={"Password"}>Password</FormLabel>
              <Form.Control
                type={"password"}
                name={"Password"}
                placeholder={"Password"}
                value={values.Password}
                onChange={handleChange}
                size={"sm"}
                isInvalid={Boolean(errors.Password && touched.Password)}
                isValid={Boolean(!errors.Password && touched.Password)}
              />
              <Form.Control.Feedback type={"invalid"}>
                {errors.Password}
              </Form.Control.Feedback>
            </FormGroup>
          </Col>
          <Col md={4} sm={6} className="mt-1 justify-content-end d-flex">
            <Link to={"/forgot-password"} className={"text-decoration-none"}>
              Forgot Password?
            </Link>
          </Col>
          <Col md={4} sm={6} className={"mt-3 d-grid"}>
            <Button type={"submit"} size={"sm"}>
              Log In
            </Button>
          </Col>
          <Col md={4} sm={6} className={"mt-3"}>
            Not having an account?{" "}
            <Link to={"/sign-up"} className={"text-decoration-none"}>
              Sign Up Here
            </Link>
          </Col>
        </Row>
      </form>
    </>
  );
}
