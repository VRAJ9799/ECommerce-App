import {Col, Row} from "react-bootstrap";
import {AiOutlineDelete, AiOutlineMinus, AiOutlinePlus} from "react-icons/all";

export default function CartItem({product, handleUpdateCart}) {
    return (
        <>

            <Row style={{border: "1px solid #e0e0e0", borderRadius: "20px"}} className={"m-1"}>
                <Col xs={2} md={2} sm={4}>
                    <img src={product.ProductId.Image} height={90}
                         className={"d-block mx-auto my-2"}
                         alt={product.Title}/>
                </Col>
                <Col xs={10} md={10} sm={8}>
                    <Row>
                        <Col md={10} sm={10} className={"mx-3 mx-md-0"}>
                            <p className={"fs-5"}>{product.ProductId.Title}</p>
                        </Col>
                        <Col md={2} sm={2} className={"mx-3 mx-md-0"}>
                            <p className={"fs-6 fw-bold"}>&#8377;{product.ProductId.Price}</p>
                        </Col>
                    </Row>
                    <Row>
                        <div className={"d-flex justify-content-between justify-content-md-center justify-content-md-between"}>
                            <div className={"d-flex justify-content-center justify-content-md-start"}>
                                <p>
                                    <button type={"button"} className={"btn mb-0 py-0"}
                                            onClick={() => handleUpdateCart(product.ProductId._id, product.QuantityPurchased - 1)}>
                                        <AiOutlineMinus size={20}/></button>
                                </p>
                                <p className={"fs-5 p-0 m-0 mx-2"}
                                   style={{verticalAlign: "middle"}}>{product.QuantityPurchased}</p>
                                <p>
                                    <button type={"button"} className={"btn mb-0 py-0"}
                                            onClick={() => handleUpdateCart(product.ProductId._id, product.QuantityPurchased + 1)}>
                                        <AiOutlinePlus size={20}/></button>
                                </p>
                            </div>
                            <div>
                                <p>
                                    <button type={"button"} className={"btn mb-0 py-0"}
                                            onClick={() => handleUpdateCart(product.ProductId._id, 0)}>
                                        <AiOutlineDelete size={20}/></button>
                                </p>
                            </div>
                        </div>
                    </Row>
                </Col>
            </Row>
        </>
    )
}