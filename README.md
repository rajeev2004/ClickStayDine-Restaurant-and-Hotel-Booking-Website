## **ClickStayDine - Restaurant & Hotel Booking Platform**

ClickStayDine is a **restaurant and hotel booking web application** that allows users to explore listings, make reservations, and manage their bookings seamlessly. The platform also provides **a vendor dashboard** for businesses to list and manage their hotels and restaurants.

## **Features**

### **User Features**
- **Authentication** – Secure user registration and login.
- **Browse Listings** – Discover hotels and restaurants with descriptions, images, and ratings.
- **Search & Filter** – Find accommodations and dining options based on location, price, and availability.
- **Booking System** – Users can book hotel rooms and restaurant tables in real-time.
- **Manage Bookings** – View, update, or cancel reservations from the user dashboard.

### **Vendor Features**
- **Vendor Dashboard** – Allows hotel and restaurant owners to manage their listings.
- **Add & Update Listings** – Vendors can create, edit, or remove hotels and restaurants.
- **Manage Bookings** – View customer reservations and update availability.
- **Revenue Tracking** – Monitor total earnings and customer bookings.

### **Admin Features**
- **Admin Dashboard** – Admins can monitor user activity and manage the platform.
- **User & Vendor Management** – View, delete, or modify accounts.
- **Booking Insights** – Track total bookings and platform performance.

## **Technologies Used**

- **Frontend**: React.js (Vite) for a dynamic and responsive user experience.
- **Backend**: Node.js and Express.js for handling API requests.
- **Database**: PostgreSQL for secure and scalable data storage.
- **Styling**: CSS for modern UI design.
- **Libraries**: Axios for API communication, React Router for navigation.

## Link

- **Backend Repository**: https://github.com/rajeev2004/ClickStayDine-Backend

## **Setup Instructions**

### **Backend Setup**
1. Clone the repository:
   ```bash
   git clone https://github.com/rajeev2004/ClickStayDine-Backend.git
   cd ClickStayDine-Backend

2. Install dependencies:
   ```bash
   npm install

3. Create a .env file and add the following environment variables: 
    ```bash
    DATABASE_URL=your_database_url
    SECRET_KEY=your_jwt_secret
    Admin_Code=your_admin_code

4. Start the backend server:
    ```bash
    node server.js

### **Frontend Setup**
1. Clone the repository:
   ```bash
   git clone https://github.com/rajeev2004/ClickStayDine-Restaurant-and-Hotel-Booking-Website.git
   cd ClickStayDine-Restaurant-and-Hotel-Booking-Website

2. Install dependencies:
    ```bash
    npm install

3. Create a .env file and add the following:
    ```bash
    VITE_API_BACKEND=http://localhost:5000

4. Start the frontend development server:
    ``bash
    npm run dev

5. Access the application at http://localhost:5173

## Demo

You can check out the live website [here](https://rajeev2004.github.io/ClickStayDine-Restaurant-and-Hotel-Booking-Website/).

![ClickStayDine Screenshot](https://raw.githubusercontent.com/rajeev2004/ClickStayDine-Restaurant-and-Hotel-Booking-Website/refs/heads/main/src/assets/Screenshot%202025-03-10%20163902.png?raw=true)