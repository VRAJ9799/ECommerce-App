import {Form} from "react-bootstrap";

export default function SortFilter({sortOptions,sortOrder, sortBy, handleSorting}) {
    return (
        <>
            <div>
                <Form.Label>Sort By</Form.Label>
                <Form.Control as={"select"} size={"sm"}>
                    <option value={{sortBy:"createdAt",sortOrder:"desc"}} onClick={()=>handleSorting("createdAt","desc")} selected={Boolean(sortBy==="createdAt" && sortOrder==="desc")}>Latest Products</option>
                    <option value={{sortBy:"Price",sortOrder:"asc"}} onClick={()=>handleSorting("price","asc")} selected={Boolean(sortBy==="Price" && sortOrder==="asc")}>Price Low to High</option>
                    <option value={{sortBy:"Price",sortOrder:"desc"}} onClick={()=>handleSorting("price","desc")} selected={Boolean(sortBy==="Price" && sortOrder==="desc")}>Price High to Low</option>
                </Form.Control>
            </div>
        </>
    )
}