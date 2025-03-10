import { useEffect,useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import axios from "axios";
function EditingListing() {
    const backend=import.meta.env.VITE_API_BACKEND;
    const location=useLocation();
    const navigate=useNavigate();
    const [listing,setListing]=useState(null);
    const [units,setUnits]=useState([]);
    const [error,setError]=useState('');
    useEffect(()=>{
        if(location.state){
            setListing(location.state.listing);
            setUnits(location.state.units);
        }else{
            setListing(null);
            setUnits([]);
        }
    },[location.state]);
    function handleListingChange(e){
        const {name,value}=e.target;
        if(name==="facilities" || name==="images"){
            setListing({...listing,[name]:value.split(",")})
        }else{
            setListing({...listing,[name]:value});
        }
    }
    function handleUnitChange(index,field,value){
        const updatedUnits=[...units];
        updatedUnits[index]={...updatedUnits[index],[field]:value};
        setUnits(updatedUnits);
    }
    async function handleSubmit(e){
        e.preventDefault();
        try{
            await axios.put(`${backend}/updateListing/${listing.listingid}`,listing,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }
            });
            for (const unit of units){
                await axios.put(`${backend}/updateUnit/${unit.unitid}`,unit,{
                    headers:{
                        Authorization:`Bearer ${localStorage.getItem('token')}`
                    }
                });
            }
            alert("Listing and units updated successfully");
            navigate("/vendorDashboard");
        }catch(err){
            console.error("Error updating listing:", error);
            setError(err.response?.data?.error || err.message);
        }
    }
    return (
        <div>
            <h2 style={{textAlign:'center'}}>Edit Listing</h2>
            {error && <p className="message">{error}</p>}
            <form onSubmit={handleSubmit} className="form">
                <div className="formComponents">
                    <label>Type:</label>
                    <select name="type" value={listing?.type} onChange={handleListingChange} required>
                        <option value="Hotel">Hotel</option>
                        <option value="Restaurant">Restaurant</option>
                    </select>
                </div>
                <div className="formComponents">
                    <label>Name:</label>
                    <input type="text" name="name" value={listing?.name || ''} onChange={handleListingChange} required/>
                </div>
                <div className="formComponents">
                    <label>Address:</label>
                    <input type="text" name="address" value={listing?.address || ''} onChange={handleListingChange} required/>
                </div>
                <div className="formComponents">
                    <label>Description:</label>
                    <input name="description" value={listing?.description || ''} onChange={handleListingChange} required/>
                </div>
                <div className="formComponents">
                    <label>Facilities:</label>
                    <input type="text" name="facilities" value={listing?.facilities.join(",") || ''} onChange={handleListingChange}/>
                </div>
                <div className="formComponents">
                    <label>Images (comma-separated URLs):</label>
                    <input type="text" name="images" value={listing?.images.join(",") || ''} onChange={handleListingChange}/>
                </div>
                <h3>Edit Units</h3>
                <div className="editUnitComponenet">
                    {units.length>0?(
                        units.map((unit,index)=>(
                            <div key={unit.unitid} className="editUnitComponenetChild">
                                <div className="formComponents">
                                    <label>Type: </label>
                                    <input type="text" value={unit.type} onChange={(e)=>handleUnitChange(index,"type",e.target.value)} />
                                </div>
                                <div className="formComponents">
                                    <label>Capacity: </label>
                                    <input type="number" value={unit.capacity} onChange={(e)=>handleUnitChange(index,"capacity",e.target.value)} />
                                </div>
                                <div className="formComponents">
                                    <label>Price: </label>
                                    <input type="number" value={unit.price} onChange={(e)=>handleUnitChange(index,"price",e.target.value)} />
                                </div>
                                <div className="formComponents">
                                    <label>Availability: </label>
                                    <input type="text" value={unit.availability} onChange={(e)=>handleUnitChange(index,"availability",e.target.value)} />
                                </div>
                            </div>
                        ))
                    ):(
                        <p>No units Available...</p>
                    )}
                </div>
                <button type="submit">Save Changes</button>
            </form>
            <button onClick={()=>navigate('/vendorDashboard')}>Go To Dashboard</button>
        </div>
    );
}
export default EditingListing;
