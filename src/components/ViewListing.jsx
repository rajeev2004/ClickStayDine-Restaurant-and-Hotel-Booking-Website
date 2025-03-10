import React,{useEffect,useState} from "react";
import { useNavigate,useLocation } from "react-router-dom";
import axios from "axios";
function ViewListing(){
    const backend=import.meta.env.VITE_API_BACKEND;
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
            setUnits([])
        }
        setLoading(false);
    },[location.state])
    if(loading){
        return <div><p>Loading...</p></div>
    }
    async function deleteUnit(unitId){
        try{
            const response=await axios.delete(`${backend}/deleteUnit/${unitId}`,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.status===200){
                alert("Unit deleted successfully");
                setUnits(units.filter((unit)=>unit.unitid!==unitId));
            }
        }catch(err){
            console.error(err);
            alert("Failed to delete unit");
        }
    };
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
                <h3>Images</h3>
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
                    <div>
                        <h3>Units</h3>
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
                                        <td>
                                            <button onClick={()=>deleteUnit(unit.unitid)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ):(
                    <p>No units Available...</p>
                )}
                <button onClick={()=>navigate('/vendorDashboard')}>Go To DashBoard</button>
            </div>
        </div>
    )
}
export default ViewListing;