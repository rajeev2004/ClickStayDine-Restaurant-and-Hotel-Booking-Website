import React from 'react';
import {HashRouter as Router,Routes,Route} from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import BookPlace from './components/BookPlace';
import EditingListing from './components/EditingListing';
import Login from './components/Login';
import Register from './components/Register';
import UserBookedListing from './components/UserBookedListing';
import UserDashboard from './components/UserDashboard';
import VendorDashboard from './components/VendorDashboard';
import ViewListing from './components/ViewListing';
import ViewListingUser from './components/ViewListingUser';
import NotFound from './components/NotFound';
function App(){
    return (
        <Router>
            <div>
                <Routes>
                    <Route exact path="/" element={<Register />}/>
                    <Route exact path="/viewListingUser" element={<ViewListingUser />}/>
                    <Route exact path="/bookPlace" element={<BookPlace />}/>
                    <Route exact path="/userBookedListings" element={<UserBookedListing />}/>
                    <Route exact path="/userDashboard" element={<UserDashboard />}/>
                    <Route exact path="/viewListing" element={<ViewListing />}/>
                    <Route exact path="/editListing" element={<EditingListing />}/>
                    <Route exact path="/vendorDashboard" element={<VendorDashboard />}/>
                    <Route exact path="/adminDashboard" element={<AdminDashboard />}/>
                    <Route exact path="/login" element={<Login />}/>
                    <Route path="*" element={<NotFound />}/>
                </Routes>
            </div>
        </Router>
    );
}
export default App;
