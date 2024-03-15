import React, { useState, useEffect } from "react";
import { BiCalendarCheck, BiTrash } from "react-icons/bi"; // Importing delete icon
import { confirmAlert } from 'react-confirm-alert'; // Importing confirmation dialog
import 'react-confirm-alert/src/react-confirm-alert.css'; // Importing confirmation dialog styles

const RecentBookings = () => {
  const [recentBookings, setRecentBookings] = useState({ bookings: [] }); // Initialize recentBookings with an empty array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentBookings = async () => {
      try {
        const data = await fetch("https://rely-cabs.onrender.com/api/bookings/");
        const recentBookingsData = await data.json();
        setRecentBookings(recentBookingsData);
      } catch (error) {
        console.error("Error fetching recent bookings:", error);
        // Handle error
      } finally {
        setLoading(false);
      }
    };
    fetchRecentBookings();
  }, []);

  const handleDeleteBooking = async (bookingId) => {
    try {
      const response = await fetch(`https://rely-cabs.onrender.com/api/bookings/${bookingId}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        throw new Error("Failed to delete booking");
      }
      // Remove the deleted booking from the state
      setRecentBookings(prevBookings => ({
        ...prevBookings,
        bookings: prevBookings.bookings.filter(booking => booking._id !== bookingId)
      }));
    } catch (error) {
      console.error("Error deleting booking:", error);
      // Handle error
    }
  };

  const confirmDelete = (bookingId) => {
    confirmAlert({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this booking?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => handleDeleteBooking(bookingId)
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
  };

  return (
    <div id="allbookings" className="p-12 bg-base-200">
      <div className="container mx-auto">
        <h2 className="text-3xl font-semibold mb-6">
          <BiCalendarCheck className="inline-block mr-2 text-4xl text-primary" />
          Recent Bookings
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {loading ? (
            <p>Loading...</p>
          ) : recentBookings.bookings.length > 0 ? (
            recentBookings.bookings.map((booking) => (
              <div key={booking._id} className="rounded-lg overflow-hidden shadow-md bg-white">
                <div className="p-6">
                  <p className="text-gray-800 mb-2">Source: {booking.source}</p>
                  <p className="text-gray-600 mb-2">Booking ID: {booking._id}</p>
                  <p className="text-gray-600 mb-2">Name: {booking.user.name}</p>
                  <p className="text-gray-600 mb-2">Cab: {booking.cab.name}</p>
                  <p className="text-gray-600 mb-2">Destination: {booking.destination}</p>
                  <p className="text-gray-600 mb-2">Start Time: {booking.startTime}</p>
                  <p className="text-gray-600">End Time: {booking.endTime}</p>
                </div>
                <div className="p-4 bg-base-100">
                  <BiTrash className="text-red-600 cursor-pointer" onClick={() => confirmDelete(booking._id)} />
                </div>
              </div>
            ))
          ) : <p>No recent bookings found.</p>}
        </div>
      </div>
    </div>
  );
};

export default RecentBookings;
