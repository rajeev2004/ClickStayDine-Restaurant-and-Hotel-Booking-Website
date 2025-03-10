import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import UserListing from "./UserListing";
import axios from "axios";
function UserDashboard(){
    const backend=import.meta.env.VITE_API_BACKEND;
    const navigate=useNavigate();
    const [loading,setLoading]=useState(true);
    const [listing,setListing]=useState([]);
    const [filterListing,setFilterListing]=useState([]);
    const [page,setPage]=useState(1);
    const [searchPage,setSearchPage]=useState(1);
    const [error,setError]=useState('');
    const [totalPage,setTotalPage]=useState(1);
    const [isFiltering,setIsFiltering]=useState(false);
    const [searchTotalPage,setSearchTotalPage]=useState(1);
    const [filter,setFilter]=useState({
        search:localStorage.getItem('search') || '',
        type:localStorage.getItem('type') || ''
    })
    useEffect(()=>{
        const savedListings=localStorage.getItem('filteredListings');
        if(savedListings){
            setFilterListing(JSON.parse(savedListings));
            setIsFiltering(true);
            setLoading(false);
        }else{
            setIsFiltering(false);
            fetchListing();
        }
    },[page]);
    useEffect(()=>{
        if(isFiltering){
            applyFilter();
        }
    },[searchPage])
    async function fetchListing(){
        setLoading(true);
        try{
            const result=await axios.get(`${backend}/allListing?page=${page}`);
            setListing(result.data.listing);
            setFilterListing(result.data.listing);
            if(result.data.totalPage==0){
                setTotalPage(1);
            }else{
                setTotalPage(result.data.totalPage);
            }
            setIsFiltering(false);
        }catch(err){
            setError(err.response?.data?.error || err.message || 'cannot fetch the Listings');
        }
        setLoading(false);
    }
    if(loading){
        return(
            <div>Loading...</div>
        )
    }
    async function viewDetails(listing_id){
        try{
            if(filter.search || filter.type){
                localStorage.setItem('filteredListings',JSON.stringify(filterListing));
                localStorage.setItem('search',filter.search);
                localStorage.setItem('type',filter.type);
            }
            const result=await axios.get(`${backend}/getParticularListing/${listing_id}`);
            navigate('/viewListingUser',{
                state:{
                    listings:result.data.listing,
                    units:result.data.units
                }
            })
        }catch(err){
            console.error(err);
        }
    }
    function bookPlace(listing_id){
        try{
            navigate('/bookPlace',{
                state:{
                    listing_id
                }
            });
            alert('Book The unit you want');
        }catch(err){
            console.error(err);
        }
    }
    function bookedListings(){
        navigate('/userBookedListings')
    }
    function handleFilterChange(e){
        const {name,value}=e.target;
        setFilter({...filter,[name]:value});
    }
    async function applyFilter(){
        setLoading(true);
        try{
            if(filter.type || filter.search){
                const result=await axios.get(`${backend}/applyFilter?search=${filter.search}&type=${filter.type}&page=${searchPage}`);
                setFilterListing(result.data.listing);
                setSearchTotalPage(result.data.totalPage);
                setIsFiltering(true);
                localStorage.setItem('filteredListings',JSON.stringify(filterListing));
                localStorage.setItem('search',filter.search);
                localStorage.setItem('type',filter.type);
            }else{
                alert('specify atleast one of the parameters.')
            }
        }catch(err){
            console.error(err);
            setError(err.response?.data?.error || err.message || 'Error while filtering');
        }finally{
            setLoading(false);
        }
    }
    function resetFilter(){
        setFilter({search:"",type:"" });
        setIsFiltering(false);
        setPage(1);
        setSearchPage(1);
        localStorage.removeItem("filteredListings");
        localStorage.removeItem("search");
        localStorage.removeItem("type");
        fetchListing();
    }
    function logout(){
        localStorage.removeItem('user_id');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem("filteredListings");
        localStorage.removeItem("search");
        localStorage.removeItem("type");
        navigate('/');
    }
    return(
        <div className="userDashboard">
            <div className="name">
                <h2>ClickStayDine: A single click for stays and dining</h2>
            </div>
            <div className="UserButton">
                <button onClick={bookedListings}>Booked Venues</button>
                <button onClick={logout}>Logout</button>
            </div>
            {error && <p className="message">{error}</p>}
            <div className="filters">
                <input type="text" placeholder="Search by Name or Location" name='search' value={filter.search} onChange={handleFilterChange}/>
                <select name="type" value={filter.type} onChange={handleFilterChange}>
                    <option value="">All Types</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Restaurant">Restaurant</option>
                </select>
                <button onClick={()=>applyFilter()}>Apply Filter</button>
                <button onClick={()=>resetFilter()}>Reset</button>
            </div>
            <div className="userListing">
                {filterListing.length>0?(
                    filterListing.map((listing,index)=>(
                        <UserListing
                        key={listing.listingid}
                        id={listing.listingid}
                        type={listing.type}
                        name={listing.name}
                        address={listing.address}
                        details={viewDetails}
                        book={bookPlace}/>
                    ))
                ):(
                    <p>No Venues are Available at the moment...</p>
                )}
            </div>
            {isFiltering?(
                <div className="buttonClass">
                    <button onClick={()=>setSearchPage(searchPage-1)} disabled={searchPage===1}>Previous</button>
                    <button onClick={()=>setSearchPage(searchPage+1)} disabled={searchPage===searchTotalPage || searchTotalPage===0}>Next</button>
                </div>
            ):(
                <div className="buttonClass">
                    <button onClick={()=>setPage(page-1)} disabled={page===1}>Previous</button>
                    <button onClick={()=>setPage(page+1)} disabled={page===totalPage || totalPage===0}>Next</button>
                </div>
            )}
        </div>
    )
}
export default UserDashboard;