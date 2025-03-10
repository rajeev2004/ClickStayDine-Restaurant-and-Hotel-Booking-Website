import React from "react";
function VendorUnit(props){
    return(
        <div className="vendorUnit">
            <p>Type: {props.type}</p>
            <p>Capacity: {props.capacity}</p>
            <p>Price Per Night: {props.price}</p>
            <p>Availability: {props.availability}</p>
            <button onClick={()=>props.delete(props.id)}>Delete</button>
        </div>
    )
}
export default VendorUnit;