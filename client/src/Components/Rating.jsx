import {BsStar, BsStarFill, BsStarHalf} from "react-icons/all";

export default function Rating({value}) {
    return (
        <>
            {value >= 1 ? <BsStarFill/> : value >= 0.5 ? <BsStarHalf/> : <BsStar/>}
            {value >= 2 ? <BsStarFill/> : value >= 1.5 ? <BsStarHalf/> : <BsStar/>}
            {value >= 3 ? <BsStarFill/> : value >= 2.5 ? <BsStarHalf/> : <BsStar/>}
            {value >= 4 ? <BsStarFill/> : value >= 3.5 ? <BsStarHalf/> : <BsStar/>}
            {value >= 5 ? <BsStarFill/> : value >= 4.5 ? <BsStarHalf/> : <BsStar/>}
        </>
    )
}