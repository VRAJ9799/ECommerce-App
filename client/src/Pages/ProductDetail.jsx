import {Button, Col, Container, Row} from "react-bootstrap";
import {lazy, useEffect, useState,Suspense} from "react";
import {useHistory, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import API from "../Utils/API";
import Loading from "../Components/Loading";
import {AddOrUpdateCart} from "../Reducers/CartSlice";
import {toast, Toaster} from "react-hot-toast";
import ReviewModal from "../Components/ReviewModal";
const ProductDescription = lazy(()=>import("../Components/ProductDescription"))
const Review = lazy(()=>import("../Components/Review"))



export default function ProductDetail() {
    const {id} = useParams();
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [open, setOpen] = useState(false);
    const [review, setReview] = useState({
        ProductId: null,
        Title: "",
        Rating: 0,
        Comment: "",
    });
    const {isLoggedIn, user} = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const history = useHistory();
    useEffect(() => {
        setLoading(true);
        API({
            method: "GET",
            url: `product/${id}`
        }).then(response => setProduct(response.data.product)).catch(error => {
            toast.error(error?.response?.data?.error);
            history.push("/")
        })
        setLoading(false);
    }, [id]);
    const handleQuantityChange = (value) => {
        value > 0 ? setQuantity(value) : setQuantity(1)
    }
    const handleAddToCart = () => {
        if (isLoggedIn) dispatch(AddOrUpdateCart({ProductId: product._id, Quantity: quantity}))
        else toast.error("You need to Login First")
    }
    const handleModalOpen = (productId, review) => {
        setReview(prevState => ({
            ...prevState,
            ProductId: productId,
            Title: review.Title,
            Comment: review.Comment,
            Rating: review.Rating,
            ReviewId: review._id
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
        try {
            const response = await API({
                method: "PUT",
                url: `review/update/${review.ReviewId}`,
                data: review,
                privateRoute: true
            });
            const {message} = response?.data;
            toast.success(message);
            history.push(`/product/${product._id}`)
        } catch (error) {
            toast.error(error?.response?.data?.error);
            history.push("/orders")
        }
        handleModalClose()
    }
    const handleDeleteReview = async (productId, reviewId) => {
        try {
            const response = await API({
                method: "PUT",
                url: `review/delete/${productId}/${reviewId}`,
                privateRoute: true
            });
            const {message} = response?.data;
            toast.success(message);
            history.push(`/product/${productId}`)
        } catch (error) {
            toast.error(error?.response?.data?.error);
            history.push("/orders")
        }
        handleModalClose()
    }
    return (
        <>
            {loading ? <Loading/> :
                <Container className={"mt-3"}>
                    {product ?
                        <>
                            <Row className={"mb-3"}>
                                <Col md={4}>
                                    <Button variant={"outline-secondary custom-button"} className={"py-1 px-2"}
                                            onClick={() => history.goBack()}>Go Back</Button>
                                </Col>
                            </Row>
                            <Suspense fallback={<Loading/>}>
                                <ProductDescription product={product} quantity={quantity}
                                                    handleQuantityChange={handleQuantityChange}
                                                    handleAddToCart={handleAddToCart}/>
                            </Suspense>
                            {product && product?.Reviews && product?.Reviews?.length > 0 ?
                                <Row className={"mt-3"}>
                                    <h5 className={"text-center"}>Reviews</h5>
                                </Row> : ""}
                            {product && product?.Reviews && product?.Reviews?.length > 0 ? product.Reviews.map((review) => {
                                    return (
                                        <Suspense fallback={<Loading/>}>
                                            <Review key={review._id} review={review} productId={product._id} userId={user?._id}
                                                    handleModalOpen={handleModalOpen} handleDeleteReview={handleDeleteReview}/>
                                        </Suspense>
                                    )
                                }) :
                                <Row className={"mt-3"}>
                                    <h5 className={"text-center"}>No Reviews</h5>
                                </Row>
                            }

                        </>
                        : <Loading/>
                    }
                    <ReviewModal handleModalClose={handleModalClose} open={open} setReview={setReview}
                                 review={review} handleReviewChange={handleReviewChange}/>
                    <Row>
                        <Toaster position={"bottom-center"} toastOptions={{duration: 5000}}/>
                    </Row>
                </Container>
            }
        </>
    )
}
