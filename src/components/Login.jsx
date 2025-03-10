import { jwtDecode } from "jwt-decode";
import React,{ useState } from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
function Login(){
    const backend=import.meta.env.VITE_API_BACKEND;
    const navigate=useNavigate();
    const [formData,setFormData]=useState({
        email:"",
        password:"",
    });
    const [error,setError]=useState('');
    function handleLoginChange(e){
        setFormData({...formData,[e.target.name]:e.target.value});
    };
    async function handleLoginSubmit(e){
        e.preventDefault();
        try{
            const result=await axios.post(`${backend}/login`,formData);
            if(result.data.message==='login successful'){
                setFormData({email:'',password:''});
                const decodedToken=jwtDecode(result.data.token);
                localStorage.setItem('user_id',decodedToken.Id);
                localStorage.setItem('role',decodedToken.role);
                localStorage.setItem('token',result.data.token);
                if(decodedToken.role==='user'){
                    navigate('/userDashboard');
                }else if(decodedToken.role=='vendor'){
                    navigate('/vendorDashboard');
                }else{
                    navigate('/adminDashboard');
                }
            }
        }catch(err){
            setError(err.response?.data?.error || err.message || 'login failed');
        }
    };
    return (
        <div className="login-box">
            <div className="name">
                <h2>ClickStayDine: A single click for stays and dining</h2>
            </div>
            <form onSubmit={handleLoginSubmit} className="form">
                <div className="formComponents">
                    <label>
                        Email:
                    </label>
                    <input type="email" name="email" value={formData.email} onChange={handleLoginChange} required/>
                </div>
                <div className="formComponents">
                    <label>
                        Password:
                    </label>
                    <input type="password" name="password" value={formData.password} onChange={handleLoginChange} required/>
                </div>
                <div className="formComponents">
                    <label></label>
                    <div className="buttonClass">
                        <button type="submit">Login</button>
                        <button type="button" onClick={()=>navigate('/')}>Register</button>
                    </div>
                </div>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
}
export default Login;