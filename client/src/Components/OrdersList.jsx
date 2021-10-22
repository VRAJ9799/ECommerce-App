import {Form, Table} from "react-bootstrap";
import {BsUpload} from "react-icons/all";

export default function OrdersList() {
    const statusOptions = ["Delivered", "Shipped", "Not Delivered"]
    const paidOptions = ["Not Paid", "Paid"]
    return (
        <>
            <Table striped bordered hover size="sm">
                <thead>
                <tr>
                    <th>Order Id</th>
                    <th>Items</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th>Paid</th>
                    <th>Last Updated</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>1</td>
                    <td>3</td>
                    <td>500</td>
                    <td>
                        <Form.Control as={"select"} size={"sm"}>
                            {statusOptions.map((item) => {
                                return (
                                    <option value={item} key={item}>{item}</option>
                                )
                            })}
                        </Form.Control>
                    </td>
                    <td>
                        <Form.Control as={"select"} size={"sm"}>
                            {paidOptions.map((item) => {
                                return (
                                    <option value={item} key={item}>{item}</option>
                                )
                            })}
                        </Form.Control>
                    </td>
                    <td>@mdo</td>
                    <td>
                        <BsUpload/>
                    </td>
                </tr>
                </tbody>
            </Table>
        </>
    )
}