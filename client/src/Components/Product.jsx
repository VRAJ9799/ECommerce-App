import {Card} from "react-bootstrap";
import {MdAddShoppingCart} from "react-icons/all";
import Rating from "./Rating";

export default function Product(props) {
    const {product,handleProductClick,handleAddToCart}=props;
    return (
        <>
            <Card>
                <Card.Img variant={"top"} src={product.Image} className={"mx-auto"}
                          style={{
                              height: 150, width: "min-content"
                          }}/>
                <Card.Body>
                    <Card.Title style={{cursor: "pointer"}} onClick={()=>handleProductClick(product._id)}>{product.Title}</Card.Title>
                    <Card.Text className={"star-icons"}>
                        <Rating value={product.Rating}/>
                    </Card.Text>
                    <Card.Text className={"d-flex align-items-center justify-content-between"}>
                        <strong style={{fontSize: "1.5rem"}}>${product.Price}</strong>
                        <span className={"btn border-2 mb-0 py-1 px-2 rounded "} style={{borderColor: "#03203C"}}>
                            <MdAddShoppingCart size={15} onClick={()=>handleAddToCart(product._id)}/>
                        </span>
                    </Card.Text>
                </Card.Body>
            </Card>
        </>
    )
}