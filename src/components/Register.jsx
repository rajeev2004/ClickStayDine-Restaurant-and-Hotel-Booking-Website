import React,{useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
function Register(){
    const backend=import.meta.env.VITE_API_BACKEND;
    const navigate=useNavigate();
    const [formData,setFormData]=useState({
        name:"",
        email:"",
        password:"",
        role:"user",
        privateKey:"",
      });
      const [error,setError]=useState('');
    function handleChange(e){
        setFormData({...formData,[e.target.name]:e.target.value});
    };
    async function handleSubmit(e){
        e.preventDefault();
        try{
            const result=await axios.post(`${backend}/register`,formData);
            if(result.data.message==='user registered'){
                setFormData({name:'',email:'',password:'',role:'user',privateKey:''});
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
            setError(err.response?.data?.error || err.message || 'registration failed');
        } 
    };
    return (
    <div className="register-container">
        <div className="register-box">
            <div className="name">
                <h2>ClickStayDine: A single click for stays and dining</h2>
            </div>
            <form onSubmit={handleSubmit} className="form">
                <div className="formComponents">
                    <label>
                        Name:
                    </label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required/>
                </div>
                <div className="formComponents">
                    <label>
                        Email:
                    </label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required/>
                </div>
                <div className="formComponents">
                    <label>
                        Password:
                    </label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required/>
                </div>
                <div className="formComponents">
                    <label>
                        Role:
                    </label>
                    <select name="role" value={formData.role} onChange={handleChange}>
                        <option value="user">User</option>
                        <option value="vendor">Vendor</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                {formData.role==="admin" && (
                    <div className="formComponents">
                        <label>
                            Private Key:
                        </label>
                        <input type="password" name="privateKey" value={formData.privateKey} onChange={handleChange} required/>
                    </div>
                )}
                <div className="formComponents">
                    <label></label>
                    <div className="buttonClass">
                        <button type="button" onClick={()=>navigate('/login')}>Already have an Account...</button>
                        <button type="submit">Register</button>
                    </div>
                </div>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    </div>
    );
}
export default Register;