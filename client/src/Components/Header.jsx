import {Container, Dropdown, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {FaShoppingCart, FiLogOut, GiHamburgerMenu, IoPersonAddSharp} from "react-icons/all";
import {Link, useHistory} from "react-router-dom";
import {useSelector} from "react-redux";

export default function Header({handleLogOut}) {
    const {isLoggedIn, user} = useSelector(state => state.auth);
    const history = useHistory();
    return (
        <>
            <Navbar variant={"dark"} expand="lg" className={"navbar-custom-color py-3"}>
                <Container>
                    <Navbar.Brand>
                        <Link to={"/"} className={"links"}>
                            VS Books
                        </Link>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav">
                        <GiHamburgerMenu/>
                    </Navbar.Toggle>
                    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                        <Nav>
                            {isLoggedIn ? <>
                                <Link className={"nav-link"} to={"/cart"}>Cart
                                    <FaShoppingCart className={"react-icons"}/>
                                </Link>
                                <NavDropdown id={"nav-dropdown"} title={"Account"}>
                                    <NavDropdown.Item
                                        onClick={() => history.push("/profile")}>Profile</NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => history.push("/orders")}>My
                                        Orders</NavDropdown.Item>
                                    {user.Role === "Admin" ?
                                        <>
                                            <Dropdown.Divider />
                                            <NavDropdown.Item onClick={() => history.push("/addProduct")}>Add Product</NavDropdown.Item>
                                            <NavDropdown.Item onClick={() => history.push("/users")}>Users</NavDropdown.Item>
                                            <NavDropdown.Item onClick={() => history.push("/admin-orders")}>Orders</NavDropdown.Item>
                                        </>
                                    :""}
                                </NavDropdown>
                                <Link className={"nav-link"} to={"/"} onClick={() => handleLogOut()}>LogOut
                                    <FiLogOut className={"react-icons"}/>
                                </Link>
                            </> : <>
                                <Link to={"/login"} className={"nav-link"}>
                                    Log In
                                    <IoPersonAddSharp className={"react-icons"}/>
                                </Link>
                            </>}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}
