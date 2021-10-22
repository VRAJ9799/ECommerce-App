import {Col, Container, Pagination, Row} from "react-bootstrap";
import Filter from "../Components/Filter";
import Product from "../Components/Product";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {FetchAllProducts, ProductsActions} from "../Reducers/ProductSlice";
import API from "../Utils/API";
import {useHistory} from "react-router-dom";
import Loading from "../Components/Loading";
import {AddOrUpdateCart, FetchCart} from "../Reducers/CartSlice";
import {toast, Toaster} from "react-hot-toast";

export default function HomePage() {
    const dispatch = useDispatch();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const {products, page, limit, sortBy, sortOrder, totalCount, search, filter} = useSelector(state => state.products);
    const {isLoggedIn} = useSelector(state => state.auth)
    const {cart} = useSelector(state => state.cart);
    const handleCategoryChange = (e) => {
        const {value, checked} = e.target;
        dispatch(ProductsActions.handleFilterChange({...filter, category: checked ? value : null}))
    }
    const handlePriceChange = (value) => {
        dispatch(ProductsActions.handleFilterChange({...filter, price: value}))
    }
    const handleRatingChange = (value) => {
        dispatch(ProductsActions.handleFilterChange({...filter, rating: value}))
    }
    const handleFilterReset = () => {
        dispatch(ProductsActions.handleFilterChange({price: 0, category: null, rating: 0, search: null}))
    }
    const handlePageChange = (e) => {
        dispatch(ProductsActions.handlePageChange({page: e}))
    }
    const handleProductClick = (id) => {
        history.push(`/product/${id}`)
    }
    const handleAddToCart = (id) => {
        if (cart.map((item) => item.ProductId._id).includes(id) & isLoggedIn) toast.success("Item Already added in cart");
        else if (isLoggedIn) dispatch(AddOrUpdateCart({ProductId: id, Quantity: 1}))
        else toast.error("You need to Login First");
    }
    const handleSearchChange = (search) => {
        dispatch(ProductsActions.handleSearchChange({search}));
    }
    useEffect(() => {
        setLoading(true)
        if (cart.length == 0 && isLoggedIn) dispatch(FetchCart())
        API({method: "GET", url: "categories/"}).then((response) => {
            setCategories(response.data.categories)
        }).catch(error => history.push("/"))
        setLoading(false)
        return () => {
            dispatch(ProductsActions.reset());
        }
    }, [])
    useEffect(() => {
        dispatch(FetchAllProducts({page, limit, sortBy, sortOrder, filter, search}));
    }, [page, sortBy, sortOrder, filter, search])
    return (
        <>
            <Container className={"mt-3"}>
                <Row>
                    <Col md={3}>
                        {!loading ?
                            <Filter categories={categories} ratings={[5, 4, 3, 2, 1]} category={filter.category}
                                    search={search}
                                    price={filter.price} rating={filter.rating} handleResetFilter={handleFilterReset}
                                    handleCategoryChange={handleCategoryChange} handlePriceChange={handlePriceChange}
                                    handleSearchChange={handleSearchChange}
                                    handleRatingChange={handleRatingChange}/>
                            : ""}
                    </Col>
                    <Col md={9} className={"mt-5 mt-md-0 px-5"}>
                        <Row>
                            {loading ? <Loading/> : ""}
                            {products && products.length === 0 ? (
                                <Col className={"d-flex justify-content-center align-items-center"}><h3>No Products</h3>
                                </Col>) : ""}
                            {products && products.map((product) => {
                                return (
                                    <Col md={3} sm={6} className={"mb-5"}>
                                        <Product product={product} key={product._id}
                                                 handleProductClick={handleProductClick}
                                                 handleAddToCart={handleAddToCart}/>
                                    </Col>
                                )
                            })}
                        </Row>
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
                                    <Pagination.Next disabled={Boolean(page === Math.ceil(totalCount / limit))}
                                                     onClick={() => handlePageChange(page + 1)}/>
                                </Pagination>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Toaster position={"bottom-center"} toastOptions={{duration: 5000}}/>
                </Row>
            </Container>
        </>
    )
}
