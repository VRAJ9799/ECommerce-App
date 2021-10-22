import {Col, Row} from "react-bootstrap";
import {MdRateReview} from "react-icons/all";
import Rating from "./Rating";
import {Link} from "react-router-dom";

export default function OrderItem({item, handleModalOpen}) {
    return (
        <>
            <Row className={"mt-2 p-2"}
                 style={{border: "1px solid #e0e0e0", borderRadius: "10px"}}>
                <Col md={1} sm={3} className={"align-items-center"}>
                    <img style={{width: "fit-content"}}
                         src={item.ProductId.Image} alt={item.ProductId.Title}
                         height={100}/>
                </Col>
                <Col md={11} sm={9}>
                    <Row>
                        <Col md={11}>
                            <h5 className={"p-0 m-0"}><Link to={`/product/${item.ProductId._id}`} style={{
                                textDecoration: "none",
                                color: "black"
                            }}>{item.ProductId.Title}</Link></h5>
                        </Col>
                        <Col md={1}>
                            <MdRateReview size={18} style={{
                                color: '#03203C',
                                cursor: "pointer"
                            }}
                                          onClick={() => handleModalOpen(item.ProductId._id)}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} className={"d-flex justify-content-start"}>
                            <p className={"p-0 m-0"}>{item.ProductId.Author}</p>
                        </Col>
                        <Col md={6} className={"d-flex justify-content-end"}>
                            <p className={"star-icons m-0"}><Rating
                                value={item.ProductId.Rating}/></p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p className={"p-0 m-0"}>
                                <strong>&#8377;{item.ProductId.Price}</strong>
                            </p>
                        </Col>
                    </Row>
                    <span>Quantity: {item.Quantity}</span>
                </Col>
            </Row>
        </>
    )
}