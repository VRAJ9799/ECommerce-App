import {useHistory, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import API from "../Utils/API";
import {toast} from "react-hot-toast";
import Loading from "../Components/Loading";
import {Col, Container, Row} from "react-bootstrap";
import ReviewModal from "../Components/ReviewModal";
import OrderItem from "../Components/OrderItem";

export default function OrderDetail() {
    const {id} = useParams();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState(null);
    const [open, setOpen] = useState(false);
    const [review, setReview] = useState({
        ProductId: null,
        Title: "",
        Rating: 0,
        Comment: ""
    });
    useEffect(() => {
        if (!id) {
            return history.push('/orders');
        }
        setLoading(true);
        API({method: "GET", url: `order/${id}`, privateRoute: true})
            .then(response => {
                const {order} = response.data;
                setOrder(order);
            })
            .catch(error => {
                toast.error(error?.response.data.error);
                history.push("/orders")
            })
        setLoading(false);
        return () => {
            setOrder(null)
        }
    }, [id])
    const handleModalOpen = (productId) => {
        setReview(prevState => ({
            ...prevState, ProductId: productId
        }));
        setOpen(true);
    }
    const handleModalClose = () => {
        setReview({
            ProductId: null,
            Title: "",
            Comment: "",
            Rating: 0
        });
        setOpen(false);
    }
    const handleReviewChange = async () => {
        alert("Review")
        setLoading(true);
        try {
            const response = await API({method: "PUT", url: 'review/add', data: review, privateRoute: true});
            const {message}=response?.data;
            toast.success(message);
        } catch (error) {
            toast.error(error?.response?.data?.error);
            history.push("/orders")
        }
        setLoading(false);
        setOpen(false);
    }
    return (
        <>
            {loading ?
                <Loading/> :
                <Container className={"mt-3"}>
                    {
                        order ?
                            <>
                                <Row className={"py-3 px-2 "}
                                     style={{border: "1px solid #e0e0e0", borderRadius: "10px"}}>
                                    <Col md={8} className={"d-flex justify-content-start flex-column"}>
                                        <h6>Order Id: {order?._id}</h6>
                                        <h6>Order On: {new Date(order?.createdAt).toLocaleDateString()}</h6>
                                    </Col>
                                    <Col md={4}>
                                        <h6>Status: <span
                                            className={order.IsPaid ? "text-success text-capitalize" : "text-danger text-capitalize"}> {order.Payment.PaymentStatus}</span>
                                        </h6>
                                        <h6><span
                                            className={order.IsPaid ? "text-success" : "text-danger"}>{order.IsPaid ? `Paid on ${new Date(order.Payment.modifiedAt)}` : "Not Paid"}</span>
                                        </h6>
                                        <h6 className={order.IsDelivered ? "text-success" : "text-danger"}>{order.IsDelivered ? `Delivered on ${new Date(order.DeliveredOn).toLocaleDateString()}` : "Not Delivered"}</h6>
                                    </Col>
                                </Row>
                                <Row className={"justify-content-between"}>
                                    <Col md={8} className={"py-2"}>
                                        {order.OrderItems ? order?.OrderItems.map((item) => {
                                            return (
                                                <>
                                                    <OrderItem item={item} handleModalOpen={handleModalOpen}/>
                                                </>
                                            )
                                        }) : ""}
                                    </Col>
                                    <Col md={3} className={"mt-3"}>
                                        <Row style={{border: "1px solid #e0e0e0", borderRadius: "10px"}}>
                                            <h5>Order Amount</h5>
                                            <h6>Subtotal:&#8377;{Math.abs(order.OrderItems.reduce((sum, item) => sum += item.Price, 0)).toFixed(2)}</h6>
                                            <h6>Tax:{Math.abs(order.OrderItems.reduce((sum, item) => sum += item.Price, 0) * 0.05).toFixed(2)}</h6>
                                            <h6>Delivery:&#8377;{Math.abs(order.OrderItems.reduce((sum, item) => sum += item.Price, 0) > 500 ? 0 : 100)}</h6>
                                            <h6>Total: &#8377;{Math.abs(order.TotalPrice).toFixed(2)}</h6>
                                        </Row>
                                    </Col>
                                </Row>

                            </>
                            : ""
                    }
                    <ReviewModal handleModalClose={handleModalClose} open={open} handleReviewChange={handleReviewChange}
                                 review={review} setReview={setReview}/>
                </Container>
            }
        </>
    )
}
