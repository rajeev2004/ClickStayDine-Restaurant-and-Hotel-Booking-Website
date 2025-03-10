import React,{useEffect,useState} from "react";
import { useNavigate,useLocation } from "react-router-dom";
function ViewListingUser(){
    const navigate=useNavigate();
    const location=useLocation();
    const [listings,setListings]=useState(null);
    const [units,setUnits]=useState([]);
    const [loading,setLoading]=useState(true);
    const [currentSlide,setCurrentSlide]=useState(0);
    useEffect(()=>{
        setLoading(true);
        if(location.state){
            setListings(location.state.listings);
            setUnits(location.state.units);
        }else{
            setListings(null);
            setUnits([]);
        }
        setLoading(false);
    },[location.state])
    if(loading){
        return <div><p>Loading...</p></div>
    }
    function changeSlide(step){
        if (listings?.images?.length>0){
            setCurrentSlide((prev)=>(prev+step+listings.images.length)%listings.images.length);
        }
    };
    return(
        <div className="ViewListing">
            <div className="ViewListingDetail">
                {listings && (
                    <div className="viewListingDetailContainer">
                        <h2>Name: {listings.name}</h2>
                        <p>Type: {listings.type}</p>
                        <p>Address: {listings.address}</p>
                        <p>Description: {listings.description}</p>
                        <p>Facilities: {listings.facilities.join(",")}</p>
                    </div>
                )}
                <h2>Images</h2>
                {listings?.images?.length>0?(
                    <div className="ViewListingImages">
                        <button className="prev" onClick={()=>changeSlide(-1)}>&#10094;</button>
                        <img 
                            src={listings.images[currentSlide]} 
                            alt={`Listing Image ${currentSlide+1}`} 
                            className="slide"
                        />
                        <button className="next" onClick={()=>changeSlide(1)}>&#10095;</button>
                    </div>
                ):(
                    <p>No images available</p>
                )}
                {units.length>0?(
                    <div className="units">
                        <h2>Units</h2>
                        <table border="1">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Capacity</th>
                                    <th>Price per Night</th>
                                    <th>Availability</th>
                                </tr>
                            </thead>
                            <tbody>
                                {units.map((unit)=>(
                                    <tr key={unit.unitid}>
                                        <td>{unit.type}</td>
                                        <td>{unit.capacity}</td>
                                        <td>${unit.price}</td>
                                        <td>{unit.availability}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ):(
                    <p>No units Available...</p>
                )}
                
            </div>
            <div className="viewListingUserButton">
                <button onClick={()=>navigate('/userDashboard')}>Go To DashBoard</button>
            </div>
        </div>
    )
}
export default ViewListingUser;