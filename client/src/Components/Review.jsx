import {Col, Row} from "react-bootstrap";
import {Avatar} from "@material-ui/core";
import Rating from "./Rating";
import {AiOutlineDelete, AiOutlineEdit} from "react-icons/all";

export default function Review({review,handleModalOpen,handleDeleteReview,userId,productId}){
    return(
        <>
            <div className={"shadow-sm"}>
                <Row>
                    <Col md={1} sm={4}
                         className={"d-flex justify-content-center align-items-center"}>
                        <Avatar>{review.User.Name.substr(0, 1)}</Avatar>
                    </Col>
                    <Col md={9} sm={6}>
                        <Row md={12}><p className={"p-0 m-0 fs-5"}>{review.Title}</p></Row>
                        <Row md={12}><p className={"p-0 m-0"}
                                        style={{fontSize: "0.8rem"}}>by {review.User.Name}</p>
                        </Row>
                    </Col>
                    <Col>
                        <div className={"star-icons"}>
                            <Rating value={review.Rating}/>
                        </div>
                    </Col>
                </Row>
                <Row className={"px-4 pt-2"}>
                    <Col>
                        <p className={"fs-6 text-nowrap"}>{review.Comment}</p>
                    </Col>
                </Row>
                <Row className={"px-3"}>
                    {review.User._id === userId ? <>
                            <div className={"d-flex justify-content-between"}>
                                <p>
                                    <AiOutlineEdit className={"mx-3"}
                                                   onClick={() => handleModalOpen(productId, review)}/>
                                    <AiOutlineDelete
                                        onClick={() => handleDeleteReview(productId, review._id)}/>
                                </p>
                                <p>{new Date(review.createdAt).toLocaleDateString()}</p>
                            </div>
                        </> :
                        <p className={"text-right"}>{new Date(review.createdAt).toLocaleDateString()}</p>
                    }
                </Row>
            </div>
        </>
    )
}