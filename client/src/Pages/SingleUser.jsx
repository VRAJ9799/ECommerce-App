import {Col, Container, Form, Row, Table} from "react-bootstrap";
import {Link, useHistory, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {toast, Toaster} from "react-hot-toast";
import API from "../Utils/API";
import Loading from "../Components/Loading";

export default function SingleUser() {
    const {id} = useParams();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    useEffect(() => {
        setLoading(true);
        API({method: "GET", url: `user/${id}`, privateRoute: true})
            .then((response) => setUser(response.data.user))
            .catch(error => {
                toast.error(error?.response?.data.error);
                history.push("/users");
            })
        API({method: "GET", url: `order/getMyOrders`, privateRoute: true})
            .then(response => setOrders(response?.data.orders))
            .catch(error => {
                toast.error("Some Error Occurred");
                history.push("/users");
            })
        setLoading(false);
        return () => {
            setUser(null);
        }
    }, [id])
    return (
        <>
            {loading ? <Loading/> :
                <Container className={"mt-2"}>
                    <Row>
                        <Col md={4}>
                            <h4>User Details</h4>
                        </Col>
                        <Col md={8}>
                            <h4>Orders</h4>
                        </Col>
                    </Row>
                    <Row>
                        {user ?
                            <Col md={4}>
                                <Row>
                                    Name: {user?.Name}
                                </Row>
                                <Row>
                                    Email: {user?.Email}
                                </Row>
                                <Row>
                                    Phone Number: {user?.PhoneNo}
                                </Row>
                                <Row>
                                    Role: {user?.Role}
                                </Row>
                                <Row>
                                    Verified: {user?.IsVerified?"Yes":"No"}
                                </Row>
                                <Row>
                                    Created On:{new Date(user?.createdAt).toLocaleDateString()}
                                </Row>
                                <Row>

                                </Row>
                            </Col> : ""}
                        {orders ?
                            <Col md={8}>
                                <Table size={"sm"} striped responsive>
                                    <thead>
                                    <tr>
                                        <th>Order Id</th>
                                        <th>Order Items</th>
                                        <th>Email</th>
                                        <th>Amount</th>
                                        <th>Pay</th>
                                        <th>Deliver</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {orders.map((order) => {
                                        return (
                                            <>
                                                <tr style={{verticalAlign: "middle"}}>
                                                    <td>
                                                        {order._id}
                                                    </td>
                                                    <td>{order.OrderItems.map((item) => {
                                                        return (
                                                            <>
                                                                {item.ProductName}-<strong>{item.Quantity}</strong>
                                                                <br/>
                                                            </>
                                                        )
                                                    })}</td>
                                                    <td>
                                                        <Link to={`/user/${order.User.Email}`}>
                                                            {order.User.Email}
                                                        </Link>
                                                    </td>
                                                    <td>{order.TotalPrice}</td>
                                                    <td>
                                                        <Form.Check
                                                            className={"d-flex justify-content-center align-items-center"}
                                                            checked={order.IsPaid} readOnly
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Check
                                                            className={"d-flex justify-content-center align-items-center"}
                                                            checked={order.IsDelivered} readOnly
                                                        />
                                                    </td>
                                                </tr>
                                            </>
                                        )
                                    })}
                                    </tbody>
                                </Table>
                            </Col> : ""}
                    </Row>
                    <Row>
                        <Toaster position={"bottom-center"} toastOptions={{duration: 3000}}/>
                    </Row>
                </Container>
            }

        </>
    )
}
