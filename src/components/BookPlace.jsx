import React,{useEffect,useState} from "react";
import { useLocation,useNavigate } from "react-router-dom";
import axios from "axios";
function BookPlace(){
    const backend=import.meta.env.VITE_API_BACKEND;
    const location=useLocation();
    const navigate=useNavigate();
    const [loading,setLoading]=useState(true);
    const [units,setUnits]=useState([]);
    const [listing,setListing]=useState(null);
    const [selectedUnit,setSelectedUnit]=useState(null);
    const [error,setError]=useState('');
    const [page,setPage]=useState(1);
    const [checkIn,setCheckIn]=useState("");
    const [checkOut,setCheckOut]=useState("");
    const [capacity,setCapacity]=useState(1);
    const [payment,setPayment]=useState("");
    const [totalPage,setTotalPage]=useState(1);
    const [currentSlide,setCurrentSlide]=useState(0);
    const today=new Date().toISOString().split("T")[0];
    useEffect(()=>{
        setLoading(true);
        async function fetchListing(){
            try{
                const listing=await axios.get(`${backend}/getParticularListingBooking/${location.state.listing_id}?page=${page}`);
                setListing(listing.data.listing);
                setUnits(listing.data.units);
                setTotalPage(listing.data.totalPage);
            }catch(err){
                console.error(err);
                setError(err.response?.data?.error || err.message);
            }finally{
                setLoading(false);
            }
        }
        fetchListing();
    },[page]);
    if(loading){
        return(<div>Loading...</div>)
    }
    function bookUnit(unit){
        if(unit.availability==='Yes'){
            setSelectedUnit(unit);
            alert('Fill the form at the bottom of the page to complete your booking process.');
        }else{
            alert("This unit is not available for booking.");
        }
    }
    async function handleConfirmBooking(){
        if(!checkIn || !checkOut){
            alert('please enter checkIn and checkOut date');
            return;
        }
        if(checkIn<today){
            alert("checkIn must be after today's date");
            return;
        }
        if(checkOut<=checkIn){
            alert("Check-out date must be after check-in date");
            return;
        }
        if(capacity<1 || capacity>selectedUnit.capacity){
            alert(`capacity should be between 1 and ${selectedUnit.capacity}`);
            return;
        }
        try{
            const result=await axios.post(`${backend}/bookunit/${selectedUnit.unitid}/${location.state.listing_id}/${localStorage.getItem('user_id')}`,{checkIn,checkOut,capacity,payment},{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }
            })
            if(result.data.message==="Booking successful"){
                alert("Booking successful");
                setSelectedUnit(null);
                setCheckIn("");
                setCheckOut("");
                setCapacity(1);
                setPayment("");
            }
        }catch(err){
            console.error(err);
            setError(err.response?.data?.error || err.message || 'Error while booking');
        }
    }
    function changeSlide(step){
        if (listing?.images?.length>0){
            setCurrentSlide((prev)=>(prev+step+listing.images.length)%listing.images.length);
        }
    };
    return(
        <div className="bookPlaceContainer">
            <div className="dashboardButtonContainer">
                <button onClick={()=>navigate('/userDashboard')} className="dashboardButton">Go To DashBoard</button>
            </div>
            {listing && (
                <div className="bookPlaceChild">
                    <div className="bookListings">
                        <h2>Name: {listing.name}</h2>
                        <p><strong>Address: </strong>{listing.address}</p>
                        <p><strong>Description: </strong>{listing.description}</p>
                        <p><strong>Facilities: </strong>{listing.facilities.join(",")}</p>
                    </div>
                    {error && <p className="message">{error}</p>}
                    <h2>Images</h2>
                    {listing?.images?.length>0?(
                        <div className="ViewListingImages">
                            <button className="prev" onClick={()=>changeSlide(-1)}>&#10094;</button>
                            <img 
                                src={listing.images[currentSlide]} 
                                alt={`Listing Image ${currentSlide+1}`} 
                                className="slide"
                            />
                            <button className="next" onClick={()=>changeSlide(1)}>&#10095;</button>
                        </div>
                    ):(
                        <p>No images available</p>
                    )}
                    <h2>Available Units</h2>
                    <div className="allUnitCard">
                        {units.map((unit,index)=>(
                            <div key={unit.unitid} className="unitCard">
                                <h3>Type:{unit.type}</h3>
                                <p><strong>Capacity:</strong>{unit.capacity}</p>
                                <p><strong>Price:</strong>${unit.price}/night</p>
                                <p><strong>Availability:</strong>{unit.availability}</p>
                                {unit.availability==='Yes'?(
                                    <button onClick={()=>bookUnit(unit)}>Book</button>
                                ):(
                                    <button disabled>Not Available</button>
                                )}
                            </div>
                        ))}
                    </div>
                    <button onClick={()=>setPage(page-1)} disabled={page===1}>Previous</button>
                    <button onClick={()=>setPage(page+1)} disabled={page===totalPage}>Next</button>
                    {selectedUnit && (
                        <div className="bookingForm">
                            <div className="bookingFormTitle">
                                <h3>Booking for: {selectedUnit.name} ({selectedUnit.type})</h3>
                            </div>
                            <div className="bookingFormFields">
                                <div className="formComponents">
                                    <label>Check-in:</label>
                                    <input 
                                        type="date" 
                                        value={checkIn} 
                                        min={today} 
                                        onChange={(e)=>setCheckIn(e.target.value)} 
                                        required
                                    />
                                </div>
                                <div className="formComponents">
                                    <label>Check-out:</label>
                                    <input 
                                        type="date" 
                                        value={checkOut} 
                                        min={checkIn || today} 
                                        onChange={(e)=>setCheckOut(e.target.value)} 
                                        required
                                    />
                                </div>
                                <div className="formComponents">
                                    <label>Capacity:</label>
                                    <input 
                                        type="number" 
                                        min="1" 
                                        max={selectedUnit.Capacity} 
                                        value={capacity} 
                                        onChange={(e)=>setCapacity(e.target.value)} 
                                        required
                                    />
                                </div>
                                <div className="formComponents">
                                    <label>Payment Method:</label>
                                    <input 
                                        placeholder="Card Or Cash"
                                        type="text" 
                                        value={payment}  
                                        onChange={(e)=>setPayment(e.target.value)} 
                                        required
                                    />
                                </div>
                            </div>
                            <div className="bookPlaceButton">
                                <button onClick={handleConfirmBooking}>Confirm Booking</button>
                                <button onClick={()=>setSelectedUnit(null)}>Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
export default BookPlace;