import {Button, Col, Row} from "react-bootstrap";
import Rating from "./Rating";
import {FaMinus, FaPlus} from "react-icons/all";

export default function ProductDescription(props) {
    const {product,quantity, handleQuantityChange,handleAddToCart} = props;
    return (
        <>
            <Row className={"justify-content-between"}>
                <Col md={3} sm={12} className={"align-items-center align-items-md-start d-flex justify-content-center mb-5 mb-md-0"}>
                    <img src={product.Image} height={300} style={{width: "min-content"}} alt={product.Title}/>
                </Col>
                <Col md={8}>
                    <Row>
                        <h4>{product.Title}</h4>
                    </Row>
                    <Row>
                        <h6>by {product.Author}</h6>
                    </Row>
                    <Row>
                        <Col md={6} sm={12}>
                            <p className={"star-icons"}><Rating value={product.Rating}/></p>
                        </Col>
                        <Col md={6} sm={12}>
                            <p>{product.Category.Title}</p>
                        </Col>
                    </Row>
                    <Row className={"my-3"}>
                        <Col md={12} sm={12} >
                            {product.Description}
                        </Col>
                    </Row>
                    <Row className={"my-2"}>
                        <Col>
                            <h5>Price: &#8377;  {product.Price}</h5>
                        </Col>
                    </Row>
                    <Row className={"my-2"}>
                        <Col>
                            <h5>
                                Available: {product.Quantity >= 1 ? "In Stock" : "Out Of Stock"}
                            </h5>
                        </Col>
                    </Row>
                    <Row className={"mt-3 align-items-center d-flex justify-content-evenly justify-content-md-start"}>
                        <Col md={1} sm={3} className={"w-auto"}>
                            <button style={{border: "none", backgroundColor: "white"}}
                                    disabled={Boolean(quantity === 1)}
                                    onClick={() => handleQuantityChange(quantity-1)}>
                                <FaMinus size={20}/>
                            </button>
                        </Col>
                        <Col md={1} sm={1} className={"w-auto"}>
                            <h4 className={"display-inline"}>
                                {quantity}
                            </h4>
                        </Col>
                        <Col md={1} sm={3} className={"w-auto"}>
                            <button style={{border: "none", backgroundColor: "white"}}
                                    disabled={Boolean(quantity === product.Quantity)}
                                    onClick={() => handleQuantityChange(quantity+1)}>
                                <FaPlus size={20}
                                />
                            </button>
                        </Col>
                    </Row>
                    <Row className={"mt-5"}>
                        <Col md={3} sm={6} className={"d-grid gap-sm-2"}>
                            <Button type={"button"} variant={"success"} onClick={()=>handleAddToCart()}>Add To Cart</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    )
}