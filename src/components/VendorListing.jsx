import React,{useState,useRef} from "react";
import {motion,useInView} from "framer-motion";
function VendorListing(props){
    const ref=useRef();
    const isInView=useInView(ref,{threshold:0.2});
    return(
        <motion.div
        ref={ref}
        initial={{opacity:0,y:20}}
        animate={isInView?{opacity:1,y:0}:{opacity:0,y:20}}
        transition={{duration:0.5}}
        className="individualListing">
            <div className="listingDetail">
                <p>Type: {props.type}</p>
                <p>Name: {props.name}</p>
                <p>Address: {props.Address}</p>
            </div>
            <div className="listingButtons">
                <button type="button" onClick={()=>props.details(props.id)}>View Details</button>
                <button type="button" onClick={()=>props.edit(props.id)}>Edit</button>
                <button type="button" onClick={()=>props.delete(props.id)}>Delete</button>
            </div>
        </motion.div>
    )
}
export default VendorListing;