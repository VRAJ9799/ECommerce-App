import {useEffect, useState} from "react";
import * as Yup from 'yup';
import {useFormik} from "formik";
import Loading from "../Components/Loading";
import CreateProduct from "../Components/CreateProduct";
import API from "../Utils/API";
import {toast, Toaster} from "react-hot-toast";
import {useHistory} from "react-router-dom";
import {Button, Col, Container, Row} from "react-bootstrap";

export default function NewProduct() {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [productImage, setProductImage] = useState({});
    const initialValues = {
        Title: "",
        Description: "",
        Quantity: 0,
        Author: "",
        Price: 0,
        Category: "",
    }
    const validationSchema = Yup.object().shape({
        Title: Yup.string().required("Title is Required").matches(/^[a-z\d ]+$/i, {message: "Should only contain alphabets, digits and space"}).max(30, "Must be less 30 characters"),
        Description: Yup.string().required("Description is Required"),
        Quantity: Yup.number().required("Quantity is Required").min(1),
        Author: Yup.string().required("Author is Required").matches(/^[a-zA-Z\d ]+$/i, {message: "Should only contain alphabets, digits and space"}).max(30, "Must be less 30 characters"),
        Price: Yup.number().required("Price is Required").min(1, "Price Should be higher than 1"),
        Category: Yup.string().required("Category is Required"),
    })

    useEffect(() => {
        setLoading(true)
        API({method: "GET", url: "categories/"}).then((response) => {
            setCategories(response.data.categories)
        }).catch(error => toast.error("Please refresh"))
        setLoading(false)
    }, [])
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: values => handleNewProduct(values)
    })

    const handleNewProduct = async ({Title, Quantity, Author, Price, Category, Description}) => {
        setLoading(true);
        const headers = {'content-type': "multipart/form-data"};
        const formData = new FormData();
        formData.append("ProductImage", productImage);
        formData.append("Title", Title);
        formData.append("Quantity", Quantity);
        formData.append("Author", Author);
        formData.append("Price", Price);
        formData.append("Category", Category);
        formData.append("Description", Description);
        try {
            const response = await API({
                method: "POST",
                url: "product/add",
                headers,
                data: formData,
                privateRoute: true
            });
            const {message} = response?.data;
            toast.success(message);
            // history.push("/")
        } catch (error) {
            toast.error(error?.response?.data?.error);
            // formik.resetForm();
        }
        setLoading(false);
    }


    return (
        <>
            {loading ? <Loading/> :
                <Container className={"mt-3"}>
                    <Row>
                        <Col md={4}>
                            <Button variant={"outline-secondary custom-button"} className={"py-1 px-2"}
                                    onClick={() => history.goBack()}>Go Back</Button>
                        </Col>
                    </Row>
                    <CreateProduct formik={formik} categories={categories} setProductImage={setProductImage}/>
                    <Row>
                        <Toaster position={"bottom-center"} toastOptions={{duration: 3000}}/>
                    </Row>
                </Container>
            }
        </>
    )
}
