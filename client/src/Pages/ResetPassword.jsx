import {useHistory, useParams} from "react-router-dom";
import {Button, Col, Container, Form, FormGroup, FormLabel, Row} from "react-bootstrap";
import {toast, Toaster} from "react-hot-toast";
import {useEffect, useState} from "react";
import API from "../Utils/API";
import Loading from "../Components/Loading";

export default function ResetPassword() {
    const {token} = useParams();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    useEffect(() => {
        if (!token) {
            history.push("/login");
        }
    }, [token]);
    const handleResetPassword = async () => {
        setLoading(true);
        try {
            if (password !== confirmPassword) {
                toast.error("Password and ConfirmPassword are not same")
                return;
            }
            const response = await API({method: "PUT", url: `user/reset-password`, data: {token, password}});
            const {message} = response?.data;
            toast.success(message);
            history.push("/login");
        } catch (error) {
            toast.error(error?.response.data.error);
        }
        setLoading(false);
    }
    return (
        <>
            {loading ? <Loading/> :
                <Container className={"mt-3"}>
                    <form onSubmit={handleResetPassword} className={"mt-3"}>
                        <Row className={"justify-content-center"}>
                            <Col md={4}>
                                <h4 className={"text-center"}>Reset Password</h4>
                            </Col>
                        </Row>
                        <Row className={"justify-content-center"}>
                            <Col md={4}>
                                <FormGroup className={"mt-2"}>
                                    <FormLabel htmlFor={"password"}>Password</FormLabel>
                                    <Form.Control type={"password"} name={"password"} value={password}
                                                  placeholder={"Password"}
                                                  size={"sm"}
                                                  onChange={(e) => setPassword(e.target.value)}/>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className={"justify-content-center"}>
                            <Col md={4}>
                                <FormGroup className={"mt-2"}>
                                    <FormLabel htmlFor={"confirmPassword"}>Password</FormLabel>
                                    <Form.Control type={"password"} name={"confirmPassword"} value={confirmPassword}
                                                  placeholder={"Confirm Password"}
                                                  size={"sm"}
                                                  onChange={(e) => setConfirmPassword(e.target.value)}/>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className={"mt-3 justify-content-center"}>
                            <Col md={3}>
                                <div className={"d-grid gap-2"}>
                                    <Button variant={"success"} disabled={loading} block={true} type={"submit"}
                                            size={"sm"}>Submit</Button>
                                </div>
                            </Col>
                        </Row>
                    </form>
                    <Row>
                        <Toaster position={"bottom-center"} toastOptions={{duration: 3000}}/>
                    </Row>
                </Container>
            }
        </>
    )
}