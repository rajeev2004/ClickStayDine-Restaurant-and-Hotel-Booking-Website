import React,{useEffect,useState} from "react";
import { useNavigate,useLocation } from "react-router-dom";
import axios from "axios";
function UserBookedListing(){
    const backend=import.meta.env.VITE_API_BACKEND;
    const navigate=useNavigate();
    const [bookedUnits,setBookedUnits]=useState([]);
    const [page,setPage]=useState(1);
    const [totalPage,setTotalPage]=useState(1);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState('');
    useEffect(()=>{
        async function fetchBooking(){
            setLoading(true);
            try{
                const result=await axios.get(`${backend}/getBooking/${localStorage.getItem('user_id')}?page=${page}`);
                setBookedUnits(result.data.booking);
                setTotalPage(result.data.totalPage);
            }catch(err){
                setError(err.response?.data?.error || err.message || 'Error while fetching bookings');
            }finally{
                setLoading(false);
            }
        }
        fetchBooking();
    },[page]);
    if(loading){
        return(
            <div>Loading...</div>
        )
    }
    return(
        <div className="bookedUnitContainer">
            {error && <p className="message">{error}</p>}
            <div className="bookedUnitContainerChild">
                {bookedUnits.map((unit,index)=>(
                    <div key={index} className="bookedUnit">
                        <h3>Name: {unit.listingname}</h3>
                        <p><strong>Address:</strong> {unit.listingaddress}</p>
                        <p><strong>Unit:</strong> {unit.type}</p>
                        <p><strong>Price:</strong> ${unit.price} per night</p>
                        <p><strong>Capacity:</strong> {unit.capacity} people</p>
                        <p><strong>Status:</strong> {unit.status}</p>
                        <p><strong>Booking Dates:</strong> {unit.bookingdates.checkIn} To {unit.bookingdates.checkOut}</p>
                        <p><strong>Payment:</strong> {unit.paymentdetails}</p>
                    </div>
                ))}
            </div>
            <div className="pagination">
                <button disabled={page===1} onClick={()=>setPage(page-1)}>Previous</button>
                <span>Page {page} of {totalPage}</span>
                <button disabled={page===totalPage || totalPage===0} onClick={()=>setPage(page+1)}>Next</button>
            </div>
            <button onClick={()=>navigate('/userDashboard')}>Go To Homepage</button>
        </div>
    )
}
export default UserBookedListing;