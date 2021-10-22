import {useDispatch, useSelector} from "react-redux";
import {Link, useHistory} from "react-router-dom";
import {FetchAllUsers, UserActions} from "../Reducers/UsersSlice";
import {Col, Container, Form, Pagination, Row, Table} from "react-bootstrap";
import {toast, Toaster} from "react-hot-toast";
import {useEffect, useState} from "react";
import {AiFillDelete} from "react-icons/all";
import API from "../Utils/API";

export default function Users() {
    const dispatch = useDispatch();
    const history = useHistory();
    const {userList, isLoading, search, page, limit, totalCount} = useSelector(state => state.user);
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        dispatch(FetchAllUsers({page, search, limit}));
        return () => {
            dispatch(UserActions.reset());
        }
    }, [search, page])
    const handlePageChange = (page) => {
        dispatch(UserActions.handlePageChange({page}));
    }
    const handleSearchChange = (search) => {
        dispatch(UserActions.handleSearchChange({search}));
    }

    const handleDeleteUser = async (id) => {
        setLoading(true);
        try {
            const response = await API({method: "DELETE", url: `user/${id}`, privateRoute: true});
            const {message} = response?.data;
            toast.success(message);
            dispatch(FetchAllUsers({page, search, limit}));
        } catch (error) {
            toast.error(error?.response.data.error);
        }
        setLoading(false);
    }
    return (
        <>
            <Container className={"mt-5"}>
                <Row className={"justify-content-end"}>
                    <Col md={3}>
                        <Form.Control type={"text"} name={"search"} size={"sm"} value={search}
                                      placeholder={"Search User"}
                                      onChange={(e) => handleSearchChange(e.target.value)}/>
                    </Col>
                </Row>
                <Row className={"mt-2"}>
                    <Table size={"sm"} striped responsive>
                        <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {userList.length > 0 ? userList.map((user) => {
                                return (
                                    <tr>
                                        <td>
                                            <Link to={`/user/${user._id}`}>{user._id}</Link>
                                        </td>
                                        <td>{user.Name}</td>
                                        <td>{user.Email}</td>
                                        <td>{user.Role}</td>
                                        <td>
                                            <div>
                                                <AiFillDelete onClick={() => handleDeleteUser(user._id)}/>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                            : ""}
                        </tbody>
                    </Table>
                </Row>
                {userList.length === 0 ?
                    <>
                        <Row>
                            <Col>
                                <h5 className={"text-center"}>No Users Found</h5>
                            </Col>
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
                    </> : ""
                }
                <Row>
                    <Toaster position={"bottom-center"} toastOptions={{duration: 3000}}/>
                </Row>
            </Container>
        </>
    )
}
