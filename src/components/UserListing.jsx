import React,{useState,useRef} from "react";
import {motion,useInView} from "framer-motion"
function UserListing(props){
    const ref=useRef();
    const isInView=useInView(ref,{threshold:0.2});
    return(
        <motion.div 
        className="individualListing"
        ref={ref} 
        initial={{opacity:0,y:20}}
        animate={isInView?{opacity:1,y:0}:{opacity:0,y:20}}
        transition={{duration:0.5}}>
            <div className="listingDetail">
                <p>Type: {props.type}</p>
                <p>Name: {props.name}</p>
                <p>Address: {props.address}</p>
            </div>
            <div className="listingButtons">
                <button type="button" onClick={()=>props.details(props.id)}>View Details</button>
                <button type="button" onClick={()=>props.book(props.id)}>Book</button>
            </div>
        </motion.div>
    )
}
export default UserListing;