import { Link } from "react-router-dom";
import Booking from "../components/Booking";
import RecentBookings from "../components/RecentBookings";

const Homepage = () => {
  return (
    <>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content grid md:grid-cols-2 gap-8 items-center justify-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-4">
              Welcome to RelyCabs Cab Booking
            </h1>
            <p className="text-lg mb-6">
              Book a cab and get to your destination with ease. We provide the
              best cab service in town. Get started now!
            </p>
            <div className="flex gap-5">
              <a href="#newbooking" className="btn btn-primary">
                Book Cab
              </a>
              <a href="#allbookings" className="btn btn-secondary">
                View All Bookings
              </a>
            </div>
          </div>
          <img
            src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_698,h_873/v1684852612/assets/ba/4947c1-b862-400e-9f00-668f4926a4a2/original/Ride-with-Uber.png"
            alt="Cab booking"
            className="max-w-lg rounded-lg shadow-2xl"
          />
        </div>
      </div>
      <div className="hero min-h-screen bg-base-200" id="newbooking">
        <div className="hero-content grid md:grid-cols-2 gap-8 items-center justify-center">
          <img
            src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_698,h_698/v1696243819/assets/18/34e6fd-33e3-4c95-ad7a-f484a8c812d7/original/fleet-management.jpg"
            alt="Fleet management"
            className="max-w-lg rounded-lg shadow-2xl"
          />
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-4">Book A Cab</h1>
            <Booking />
          </div>
        </div>
      </div>
      <RecentBookings />
    </>
  );
};

export default Homepage;
