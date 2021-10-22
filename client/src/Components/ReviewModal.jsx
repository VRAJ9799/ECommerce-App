import {Button, Col, Container, Form, FormGroup, Modal, Row} from "react-bootstrap";
import {Rating} from "@material-ui/lab";


export default function ReviewModal({open, handleModalClose, handleReviewChange, review, setReview}) {
    return (
        <>
            <Modal show={open} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Write a review? </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <form onSubmit={handleReviewChange}>
                            <Row className={"justify-content-center"}>
                                <Col md={10}>
                                    <FormGroup className={"mt-2"}>
                                        <Form.Label htmlFor={"Title"}>Title</Form.Label>
                                        <Form.Control type={"text"} name={"Title"} value={review.Title}
                                                      required={true} size={"sm"}
                                                      pattern={/^[a-zA-Z ]+$/}
                                                      onChange={(e) => {
                                                          setReview(prevState => ({
                                                              ...prevState,
                                                              Title: e.target.value
                                                          }));
                                                      }}/>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row className={"justify-content-center"}>
                                <Col md={10}>
                                    <FormGroup className={"mt-2"}>
                                        <Form.Label htmlFor={"Comment"}>Comment</Form.Label>
                                        <Form.Control as={"textarea"} name={"Comment"} value={review.Comment}
                                                      required={true} size={"sm"}
                                                      rows={5}
                                                      onChange={(e) => {
                                                          setReview(prevState => {
                                                              return {...prevState, Comment: e.target.value}
                                                          });
                                                      }}/>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row className={"justify-content-center"}>
                                <Col md={10}>
                                    <FormGroup className={"mt-2"}>
                                        <Rating className={"star-icons"} defaultValue={0} value={review.Rating}
                                                precision={0.5} min={0} max={5} name={"RateProduct"}
                                                onChange={(e, value) => {
                                                    setReview(prevData => ({...prevData, Rating: value}))
                                                }}/>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </form>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={"success"} type={"button"} size={"sm"}
                            onClick={() => handleReviewChange()}>Submit</Button>
                    <Button variant={"danger"} type={"button"} size={"sm"}
                            onClick={() => handleModalClose()}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
