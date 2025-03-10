import React,{useState,useRef} from "react";
import {motion,useInView} from "framer-motion";
import { useNavigate } from "react-router-dom";
const VendorBooking=({
    id,
    customerName,
    customerEmail,
    customerContact,
    listingName,
    listingType,
    listingAddress,
    unitType,
    unitCapacity,
    unitPrice,
    bookingDates,
    status,
    paymentDetails,
    onUpdateStatus
})=>{
    const ref=useRef();
    const isInView=useInView(ref,{threshold:0.2});
    const navigate=useNavigate();
    const [currentStatus,setCurrentStatus]=useState(status);
    function handleStatusChange(event){
        const newStatus=event.target.value;
        setCurrentStatus(newStatus);
        onUpdateStatus(id,newStatus);
    };
    return(
        <motion.div
        ref={ref}
        initial={{opacity:0,y:20}}
        animate={isInView?{opacity:1,y:0}:{opacity:0,y:20}}
        transition={{duration:0.5}}
        className="vendorBooking">
            <p><strong>Status: </strong> 
                {currentStatus==="Pending"?(
                    <select value={currentStatus} onChange={handleStatusChange} className="statusChange">
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                ):(
                    <span className={`text-${currentStatus ==="Confirmed"?"green":"red"}-500`}>
                        {currentStatus}
                    </span>
                )}
            </p>
            <div className="vendorBookingChild">
                <h3>Customer Details:</h3>
                <p><strong>Name:</strong>{customerName}</p>
                <p><strong>Email:</strong>{customerEmail}</p>
                <p><strong>Contact:</strong>{customerContact}</p>
            </div>
            <div className="vendorBookingChild">
                <h3>Listing Details:</h3>
                <p><strong>Name:</strong>{listingName}({listingType})</p>
                <p><strong>Address:</strong>{listingAddress}</p>
            </div>
            <div className="vendorBookingChild">
                <h3>Unit Details:</h3>
                <p><strong>Type:</strong>{unitType}</p>
                <p><strong>Capacity:</strong>{unitCapacity} person(s)</p>
                <p><strong>Price per night:</strong> ${unitPrice}</p>
            </div>
            <div className="vendorBookingChild">
                <h3>Booking Dates:</h3>
                <p><strong>Check-in:</strong>{bookingDates.checkIn}</p>
                <p><strong>Check-out:</strong>{bookingDates.checkOut}</p>
            </div>
            <div className="vendorBookingChild">
                <h3>Payment Details:</h3>
                <p><strong>Method:</strong>{paymentDetails}</p>
            </div>
        </motion.div>
    );
};
export default VendorBooking;
