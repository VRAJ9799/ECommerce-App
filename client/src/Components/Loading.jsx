import {Spinner} from "react-bootstrap";

export default function Loading(){
    return(
        <>
            <center  className={"h-100"}>
                <Spinner animation={"border"} role={"status"} variant={"primary"}/>
            </center>
        </>
    )
}