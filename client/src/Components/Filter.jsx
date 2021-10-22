import {Button, Container, Form} from "react-bootstrap";
import Rating from "./Rating";

export default function Filter({
                                   category,
                                   rating,
                                   price,
                                   search,
                                   categories,
                                   ratings,
                                   handlePriceChange,
                                   handleCategoryChange,
                                   handleRatingChange,
                                   handleResetFilter,
                                   handleSearchChange
                               }) {
    return (
        <>
            <Container className={"position-sticky"} style={{top: 50}}>
                <h4>Filter</h4>
                <div className={"my-3"}>
                    <Form.Control type={"text"} size={"sm"} value={search} placeholder={"search..."}
                                  onChange={(e) => handleSearchChange(e.target.value)}/>
                </div>
                <div>
                    {categories.length > 0 ?
                        <>
                            <h6>Category</h6>
                            {categories.map((categoryItem) => (
                                <Form.Check type={"checkbox"} name={"Category"} label={categoryItem.Title}
                                            key={categoryItem._id} value={categoryItem._id}
                                            checked={Boolean(categoryItem._id === category)}
                                            onChange={(e) => handleCategoryChange(e)}/>))}
                        </> : ""}
                    <h6 className={"mt-2"}>Price</h6>
                    <Form.Label htmlFor={"price_range"}>{price}</Form.Label>
                    <input type={"range"} className={"form-range"} value={price} min={0} max={1000}
                           id={"price_range"} step={50}
                           onInput={(e) => handlePriceChange(Number(e.target.value))}/>
                    <h6>Rating</h6>
                    {ratings.map(item => <p className={item === rating ? "star-icons m-0" : "m-0"} key={item}
                                            onClick={() => handleRatingChange(item)}><Rating value={item}/></p>)}
                </div>
                <div className={"ml-auto mt-5 justify-content-end"}>
                    <Button className={"rounded"} size={"sm"} onClick={() => handleResetFilter()}>Reset Filters</Button>
                </div>
            </Container>
        </>
    )
}