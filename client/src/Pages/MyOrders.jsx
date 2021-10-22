import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {useEffect} from "react";
import {FetchMyOrders} from "../Reducers/OrderSlice";
import Loading from "../Components/Loading";
import {Container, Row, Table} from "react-bootstrap";

export default function MyOrders() {
    const dispatch = useDispatch();
    const {
        orderList,
        page,
        isLoading,
        limit,
        sortBy,
        sortOrder
    } = useSelector(state => state.orders);
    useEffect(() => {
        dispatch(FetchMyOrders({page, limit, sortBy, sortOrder}));
    }, [page])
    return (
        <>
            {isLoading ?
                <Loading/>
                :
                <Container className={"mt-3"}>
                    <Row>
                        <h5>Order History</h5>
                    </Row>
                    <Row>
                        <Table size={"sm"} striped responsive>
                            <thead>
                            <tr>
                                <th>Id</th>
                                <th>Items</th>
                                <th>Amount</th>
                                <th>Paid</th>
                                <th>Delivered</th>
                                <th>Ordered On</th>
                            </tr>
                            </thead>
                            <tbody>
                            {orderList.length > 0 ? orderList.map(order => {
                                return (
                                    <tr>
                                        <td>
                                            <Link to={`/order/${order._id}`}>{order._id}</Link>
                                        </td>
                                        <td>{order.OrderItems.map((item) => {
                                            return (
                                                <>
                                                    {item.ProductName}-<strong>{item.Quantity}</strong>
                                                    <br/>
                                                </>
                                            )
                                        })}
                                        </td>
                                        <td>
                                            &#8377;{Math.abs(order.TotalPrice / 100).toFixed(2)}
                                        </td>
                                        <td>{order.IsPaid ? "Paid" : "Not Paid"}</td>
                                        <td>{order.IsPaid ? "Delivered" : "Not Delivered"}</td>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                )
                            }) : ""}
                            </tbody>
                        </Table>
                    </Row>
                </Container>
            }
        </>
    )
}
