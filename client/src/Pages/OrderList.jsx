import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import {FetchAllAdminOrders, OrderActions} from "../Reducers/OrderSlice";
import Loading from "../Components/Loading";
import {Col, Container, Form, Pagination, Row, Table} from "react-bootstrap";
import {FaEdit, FaSave} from "react-icons/all";
import {toast, Toaster} from "react-hot-toast";
import API from "../Utils/API";

export default function OrderList() {
    const {orderList, isLoading, page, limit, sortBy, sortOrder,totalCount} = useSelector(state => state.orders)
    const dispatch = useDispatch();
    const history = useHistory();
    const [editable, setEditable] = useState(false);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        dispatch(FetchAllAdminOrders({page, limit, sortBy, sortOrder}));
    }, [page, limit, sortBy, sortOrder])


    const handlePageChange=(page)=>{
        dispatch(OrderActions.handlePageChange({page}));
    }

    const handlePayChange = async (id) => {
        setLoading(true);
        try {
            const response = await API({method: "PUT", url: `order/pay/${id}`, privateRoute: true});
            const {message} = response?.data;
            toast.success(message);
            dispatch(OrderActions.handleStateChange({id, name: "IsPaid"}))
        } catch (error) {
            toast.error(error?.response.data);
        }
        setLoading(false);
    }
    const handleDeliverChange = async (id) => {
        setLoading(true);
        try {
            const response = await API({method: "PUT", url: `order/deliver/${id}`, privateRoute: true});
            const {message} = response?.data;
            toast.success(message);
            dispatch(OrderActions.handleStateChange({id, name: "IsDelivered"}))
        } catch (error) {
            toast.error(error?.response.data.error);
        }
        setLoading(false);
    }


    return (
        <>
            {isLoading ? <Loading/> : ""}
            <Container>
                <Row>
                    <h3>Orders</h3>
                </Row>
                <Table size={"sm"} striped bordered responsive>
                    <thead>
                    <tr>
                        <th>Order Id</th>
                        <th>Order Items</th>
                        <th>Email</th>
                        <th>Amount</th>
                        <th>Pay</th>
                        <th>Deliver</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orderList.map((order) => {
                        return (
                            <>
                                <tr style={{verticalAlign: "middle"}}>
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
                                    })}</td>
                                    <td>
                                        <Link to={`/user/${order.User.Email}`}>
                                            {order.User.Email}
                                        </Link>
                                    </td>
                                    <td>{order.TotalPrice}</td>
                                    <td>
                                        <Form.Check className={"d-flex justify-content-center align-items-center"}
                                                    checked={order.IsPaid} disabled={!editable || order.IsPaid}
                                                    onClick={() => handlePayChange(order._id)}/>
                                    </td>
                                    <td>
                                        <Form.Check className={"d-flex justify-content-center align-items-center"}
                                                    checked={order.IsDelivered}
                                                    disabled={!editable || order.IsDelivered}
                                                    onClick={() => handleDeliverChange(order._id)}
                                        />
                                    </td>
                                    <td>
                                        <div className={"d-flex justify-content-center align-items-center"}>
                                            {editable ?
                                                <FaSave style={{cursor: "pointer"}} onClick={() => setEditable(false)}/>
                                                :
                                                <FaEdit style={{cursor: "pointer"}} onClick={() => setEditable(true)}/>}
                                        </div>
                                    </td>
                                </tr>
                            </>
                        )
                    })}
                    </tbody>
                </Table>
                <Row>
                    <Col className={"d-flex justify-content-center"}>
                        <Pagination size={"sm"}>
                            <Pagination.Prev disabled={Boolean(page === 1)}
                                             onClick={() => handlePageChange(page - 1)}/>
                            {[...Array(Math.ceil(totalCount / limit) + 1).keys()].map((item) => {
                                if (item !== 0) {
                                    return (
                                        <Pagination.Item key={item} active={Boolean(page === item)}
                                                         activeLabel={null}
                                                         onClick={() => handlePageChange(item)}>{item}</Pagination.Item>
                                    )
                                }
                            })}
                            <Pagination.Next disabled={Boolean(page === totalCount / limit)}
                                             onClick={() => handlePageChange(page + 1)}/>
                        </Pagination>
                    </Col>
                </Row>
                <Row>
                    <Toaster position={"bottom-right"} toastOptions={{duration: 3000}}/>
                </Row>
            </Container>
        </>
    )
}
