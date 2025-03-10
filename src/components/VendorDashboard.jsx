import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import VendorUnit from "./VendorUnit";
import VendorBooking from "./VendorBooking";
import VendorListing from "./VendorListing";
function VendorDashboard(){
    const backend=import.meta.env.VITE_API_BACKEND;
    const navigate=useNavigate();
    const vendor_id=localStorage.getItem('user_id');
    const [listings,setListings]=useState([]);
    const [bookings,setBooking]=useState([]);
    const [listingPage,setListingPage]=useState(1);
    const [bookingPage,setBookingPage]=useState(1);
    const [loadingListing,setLoadingListing]=useState(true);
    const [loadingBooking,setLoadingBooking]=useState(true);
    const [listingError,setListingError]=useState('');
    const [bookingError,setBookingError]=useState('');
    const [totalListingPage,setTotalListingPage]=useState(1);
    const [totalBookingPage,setTotalBookingPage]=useState(1);
    const [error,setError]=useState('');
    const [newListing,setNewListing]=useState({
        type:'Hotel',
        name:'',
        address:'',
        description:'',
        facilities:[],
        images:[]
    })
    const [unit,setUnit]=useState({
        type:'',
        price:'',
        capacity:'',
        availability:'',
    })
    const [units,setUnits]=useState([]);
    useEffect(()=>{
        fetchListing(listingPage);
        fetchBooking(bookingPage);
    },[listingPage,bookingPage]);
    async function fetchListing(page){
        setLoadingListing(true);
        try{
            const result=await axios.get(`${backend}/getListings/${vendor_id}?page=${page}`);
            setListings(result.data.listings);
            if(result.data.pages==0){
                setTotalListingPage(1);
            }else{
                setTotalListingPage(result.data.pages);
            }
        }catch(err){
            setListingError(err.response?.data?.error || err.message || 'error while fetching the listings');
        }
        setLoadingListing(false);
    }
    async function fetchBooking(page){
        setLoadingBooking(true);
        try{
            const result=await axios.get(`${backend}/getBookings/${vendor_id}?page=${page}`);
            setBooking(result.data.bookings);
            if(result.data.pages==0){
                setTotalBookingPage(1);
            }else{
                setTotalBookingPage(result.data.pages);
            }
        }catch(err){
            setBookingError(err.response?.data?.error || err.message || 'error while fetching bookings');
        }
        setLoadingBooking(false);
    }
    function addUnit(){
        if(!unit.type || !unit.capacity || !unit.price || !unit.availability){
            alert("Please fill in all fields before adding the unit.");
            return;
        }
        setUnits([unit,...units]);
        setUnit({type:'',price:'',capacity:'',availability:''});
    }
    function handleUnitChange(e){
        const {name,value}=e.target;
        setUnit({...unit,[name]:value});
    }
    function handleListingChange(e){
        const {name,value}=e.target;
        if(name==="facilities" || name==="images"){
            setNewListing({...newListing,[name]:value.split(",")})
        }else{
            setNewListing({...newListing,[name]:value});
        }
    }
    async function handleSubmit(e){
        e.preventDefault();
        try{
            const result=await axios.post(`${backend}/postListing`,newListing,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }
            })
            if(result.data.message==='listing posted'){
                const listing_id=result.data.listing_id;
                for(const unit of units){
                    await axios.post(`${backend}/postUnits`,{...unit,listing_id},{
                        headers:{
                            Authorization:`Bearer ${localStorage.getItem('token')}`
                        }
                    })
                }
                fetchListing(listingPage);
                alert('Diner and units successfully posted')
                setNewListing({type:'Hotel',
                    name:'',
                    address:'',
                    description:'',
                    facilities:[],
                    images:[]
                })
                setUnits([]);
            }
        }catch(err){
            setError(err.response?.data?.error || err.message || 'Error while Submitting')
        }
    }
    async function viewDetails(listing_id){
        try{
            const result=await axios.get(`${backend}/getParticularListing/${listing_id}`);
            navigate('/viewListing',{
                state:{
                    listings:result.data.listing,
                    units:result.data.units
                }
            })
        }catch(err){
            console.error(err);
        }
    }
    async function deleteDetail(listing_id){
        try{
            const result=await axios.delete(`${backend}/deleteListing/${listing_id}`,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }
            })
            alert(result.data.message);
            setListings(prev=>prev.filter((listing,index)=>listing.listingid!==listing_id));
            if(result.data.length===1){
                alert('Deleted Successfully')
            }
            fetchListing(listingPage);
        }catch(err){
            setListingError(err.response?.data?.error || err.message || 'Try again')
        }
    }
    async function editDetails(listing_id){
        try{
            const result=await axios.get(`${backend}/editListing/${listing_id}`,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }
            });
            navigate('/editListing',{
                state:{
                    listing:result.data.listing,
                    units:result.data.units
                }
            })
        }catch(err){
            setListingError(err.response?.data?.error || err.message || 'Try again')
        }
    }
    function deleteUnit(id){
        setUnits(prev=>prev.filter((unit,index)=>index!==id));
    }
    async function handleUpdateStatus(bookingId,newStatus){
        try{
            await axios.put(`${backend}/updateBookingStatus`,{bookingId,newStatus},{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }
            })
            setBooking(prev=>
                prev.map(booking=>
                    booking.bookingid===bookingId?{...booking,status:newStatus}:booking
                )
            );
        } catch(error){
            console.error("Error updating status:",error);
        }
    };
    function logout(){
        localStorage.removeItem('user_id');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
    }
    return(
        <div className="vendorDashboard">
            <div className="name">
                <h2>ClickStayDine: A single click for stays and dining</h2>
            </div>
            <button onClick={()=>logout()} className="vendorLogout">Logout</button>
            <div className="listingForm">
                <form className="form" onSubmit={handleSubmit}>
                    <div className="formComponents">
                        <label>
                            Type:
                        </label>
                        <select name="type" value={newListing.type} onChange={handleListingChange} required>
                            <option value="Hotel">Hotel</option>
                            <option value="Restaurant">Restaurant</option>    
                        </select> 
                    </div>
                    <div className="formComponents">
                        <label>
                            Name:
                        </label>
                        <input type="text" name="name" value={newListing.name} onChange={handleListingChange} required/>
                    </div>
                    <div className="formComponents">
                        <label>
                            Address:
                        </label>
                        <input type="text" name="address" value={newListing.address} onChange={handleListingChange} required/>
                    </div>
                    <div className="formComponents">
                        <label>
                            Description:
                        </label>
                        <input type="text" name="description" value={newListing.description} onChange={handleListingChange} required/>
                    </div>
                    <div className="formComponents">
                        <label>
                            Facilities:
                        </label>
                        <input type="text" name="facilities" value={newListing.facilities.join(",")} placeholder="eg: pool,wifi,breakfast" onChange={handleListingChange} required/>
                    </div>
                    <div className="formComponents">
                        <label>
                            Images URL:
                        </label>
                        <input type="text" name="images" value={newListing.images.join(',')} placeholder="comma separated URLs" onChange={handleListingChange} required/>
                    </div>
                    <div className="formComponents">
                        <label></label>
                        <button type="submit">Add Venue</button>
                    </div>
                    {error && <p className="message">{error}</p>}
                </form>
                <h3>Add units before adding the Venue...(Rooms/Tables)</h3>
                <div className="unitform">
                    <div className="formComponents">
                        <label>Type:</label>
                        <input type="text" name="type" value={unit.type} placeholder="eg: Deluxe room, VIP table" onChange={handleUnitChange} required/>
                    </div>
                    <div className="formComponents">
                        <label>Capacity:</label>
                        <input type="number" name="capacity" value={unit.capacity} onChange={handleUnitChange} required/>
                    </div>
                    <div className="formComponents">
                        <label>Price($) per Night:</label>
                        <input type="number" name="price" value={unit.price} onChange={handleUnitChange} required/>
                    </div>
                    <div className="formComponents">
                        <label>Availability:</label>
                        <input type="text" name="availability" placeholder="Yes or No" value={unit.availability} onChange={handleUnitChange} required/>
                    </div>
                    <div className="formComponents">
                        <button type="button" onClick={addUnit}>Add Unit</button>
                    </div>
                </div>
                <h3>Added Units:</h3>
                <div className="unitAdded">
                    {units.map((unit,index)=>(
                        <VendorUnit
                        key={index}
                        id={index}
                        type={unit.type}
                        capacity={unit.capacity}
                        price={unit.price}
                        availability={unit.availability}
                        delete={deleteUnit}
                        />
                    ))}
                </div>
            </div>
            <div className="vendorListings">
                <h2>Manage Venues:</h2>
                {listingError && <p className="message">{listingError}</p>}
                <div className="vendorListingChild">
                    {loadingListing?<p>Loading...</p>:(
                        listings.length===0?<p>No Venues available...</p>:(
                            listings.map((listing,index)=>(
                                <VendorListing
                                key={index}
                                id={listing.listingid}
                                type={listing.type}
                                name={listing.name}
                                Address={listing.address}
                                details={viewDetails}
                                edit={editDetails}
                                delete={deleteDetail}
                                />
                            ))
                        )
                    )}
                </div>
                <div className="vendorButtonPagination">
                    <button type="button" onClick={()=>setListingPage(listingPage-1)} disabled={listingPage===1}>Previous</button>
                    <button type="button" onClick={()=>setListingPage(listingPage+1)} disabled={listingPage===totalListingPage || totalListingPage===0}>Next</button>
                </div>
                <h2>Bookings...</h2>
                {bookingError && <p className="message">{bookingError}</p>}
                {loadingBooking?<p>Loading...</p>:(
                    bookings.length===0?<p>No bookings available...</p>:(
                        <div className="vendorBookingComponents">
                            {bookings.map((booking,index)=>(
                                <VendorBooking
                                key={booking.bookingid}
                                id={booking.bookingid}
                                customerName={booking.customername}
                                customerEmail={booking.customeremail}
                                customerContact={booking.customercontact}
                                listingName={booking.listingname}
                                listingType={booking.listingtype}
                                listingAddress={booking.listingaddress}
                                unitType={booking.unittype}
                                unitCapacity={booking.unitcapacity}
                                unitPrice={booking.unitprice}
                                bookingDates={booking.bookingdates}
                                status={booking.status}
                                paymentDetails={booking.paymentdetails}
                                onUpdateStatus={handleUpdateStatus}
                                />
                            ))}
                        </div>
                    )
                )}
                <div className="vendorButtonPagination">
                    <button type="button" onClick={()=>setBookingPage(bookingPage-1)} disabled={bookingPage===1}>Previous</button>
                    <button type="button" onClick={()=>setBookingPage(bookingPage+1)} disabled={bookingPage===totalBookingPage || totalBookingPage===0}>Next</button>
                </div>
            </div>
        </div>
    )
}
export default VendorDashboard;