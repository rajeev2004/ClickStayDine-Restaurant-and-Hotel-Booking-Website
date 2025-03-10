import React,{useState,useEffect,useRef} from "react";
import {motion,useInView} from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function AdminDashboard(){
    const ref=useRef();
    const isInView=useInView(ref,{threshold:0.2});
    const navigate=useNavigate();
    const backend=import.meta.env.VITE_API_BACKEND;
    const [users,setUsers]=useState([]);
    const [totalUsers,setTotalUsers]=useState(0);
    const [totalListings,setTotalListings]=useState(0);
    const [totalBookings,setTotalBookings]=useState(0);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState("");
    const [confirmDelete,setConfirmDelete]=useState(null);
    const [page,setPage]=useState(1);
    const [totalPage,setTotalPage]=useState(1);
    const [search,setSearch]=useState('');
    const [doSearch,setDoSearch]=useState('');
    useEffect(()=>{
        const handler=setTimeout(()=>{
            setDoSearch(search);
        },1000)
        return ()=>{
            clearTimeout(handler);
        };
    },[search]);
    useEffect(()=>{
        fetchData();
    },[page,doSearch]);
    useEffect(()=>{
        if (confirmDelete){
            alert('Confirm the dialog-box at the bottom of the page');
        }
    },[confirmDelete]);
    async function fetchData(){
        setLoading(true);
        try{
            const users=await axios.get(`${backend}/userDetail?page=${page}&search=${search}`);
            const metrics=await axios.get(`${backend}/metricsData`);
            setUsers(users.data.users);
            setTotalPage(users.data.totalPage);
            setTotalUsers(users.data.totalUsers);
            setTotalListings(metrics.data.totalListings);
            setTotalBookings(metrics.data.totalBookings);
        }catch(err){
            setError(err.response?.data?.error || "Error fetching data");
        }finally{
            setLoading(false);
        }
    }
    async function deleteUser(userId){
        try{
            const userDelete=await axios.delete(`${backend}/userDelete/${userId}`,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }
            });
            setConfirmDelete(null);
            fetchData();
        }catch(err){
            setError(err.response?.data?.error || "Error deleting the User");
        }
    }
    function logout(){
        localStorage.removeItem('user_id');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
    }
    if (loading) return <div>Loading...</div>;
    return(
        <div>
            <div className="name">
                <h2>ClickStayDine: A single click for stays and dining</h2>
            </div>
            <div className="adminDashboardHeader">
                <input 
                    type="text" 
                    placeholder="Search by Username or Email" 
                    value={search} 
                    onChange={(e)=>setSearch(e.target.value)} 
                />
                <button onClick={()=>logout()}>Logout</button>
            </div>
            <div className="metrics">
                <p>Total Users: {totalUsers}</p>
                <p>Total Listings: {totalListings}</p>
                <p>Total Bookings: {totalBookings}</p>
            </div>
            {error && <p className="message">{error}</p>}
            <h2>Users:</h2>
            <table>
                <thead>
                    <tr className="adminRow">
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length===0 && <p>No users</p>}
                    {users.map(user=>(
                        <tr key={user.userid} className="adminRow">
                            <td>{user.userid}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                {user.role!=='admin' && (<button onClick={()=>setConfirmDelete(user.userid)}>Delete</button>)}
                                
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {confirmDelete && (
                <div className="confirm-dialog">
                    <p>Are you sure you want to delete this user?</p>
                    <button onClick={()=>deleteUser(confirmDelete)}>Yes</button>
                    <button onClick={()=>setConfirmDelete(null)}>No</button>
                </div>
            )}
            <div className="adminPaginationButton">
                <button onClick={()=>setPage(page-1)} disabled={page===1}>Previous</button>
                <span>{page}</span>
                <button onClick={()=>setPage(page+1)} disabled={page===totalPage || totalPage===0}>Next</button>
            </div>
        </div>
    );
}
export default AdminDashboard;
