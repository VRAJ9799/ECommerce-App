import {Button, Col, Container, Row} from "react-bootstrap";
import CartItem from "../Components/CartItem";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {AddOrUpdateCart, CartActions, FetchCart, RemoveCart} from "../Reducers/CartSlice";
import Loading from "../Components/Loading";
import {Toaster} from "react-hot-toast";
import {Link, useHistory} from "react-router-dom";

export default function Cart() {
    const dispatch = useDispatch();
    const history = useHistory();
    const {cart, isLoading} = useSelector(state => state.cart)
    useEffect(() => {
        if (cart.length == 0) dispatch(FetchCart())
        return () => {
            dispatch(CartActions.reset());
        }
    }, []);

    const handleUpdateCart = (id, value) => {
        if (value === 0) dispatch(RemoveCart({id}));
        else dispatch(AddOrUpdateCart({ProductId: id, Quantity: value}))
    };
    return (
        <>
            <Container className={"mt-3"}>
                {cart.length > 0 ?
                    <>
                        <h5 className={"text-center"}>Cart</h5>
                        <Row className={"mt-3"}>
                            <Col md={9} sm={12}>
                                {cart.map(item => <CartItem key={item._id} product={item}
                                                            handleUpdateCart={handleUpdateCart}/>)}
                            </Col>
                            <Col md={3} sm={12}>
                                <div style={{border: "1px solid #e0e0e0", borderRadius: "20px"}}
                                     className={"py-3 px-3 d-flex justify-content-center flex-column align-items-center mt-2 mt-md-0"}>
                                    <h4>Order Now</h4>
                                    <h5>Total: {cart.reduce((sum, item) => sum += item.ProductId.Price * item.QuantityPurchased, 0)}</h5>
                                    <Button type={"success"} className={"px-4"}
                                            onClick={() => history.push("/checkout")}
                                            size={"sm"}>Check Out</Button>
                                </div>
                            </Col>
                        </Row>
                    </>
                    : <Row>
                        <h3 className={"text-center"}>
                            Your Cart is Empty <Link to={"/"} style={{textDecoration: "none"}}>Shop Now</Link>
                        </h3>
                    </Row>
                }

                <Row>
                    <Col className={"d-flex justify-content-center"}>
                        {isLoading ? <Loading/> : ""}
                        <Toaster position={"bottom-center"} toastOptions={{duration: 2000}}/>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
