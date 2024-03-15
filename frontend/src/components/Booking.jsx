import React, { useState } from "react";

function Booking() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    source: "",
    destination: "",
    startTime: "",
    date: "", // Add date state
  });

  const [availableCabs, setAvailableCabs] = useState([]);
  const [selectedCab, setSelectedCab] = useState(null);
  const [isFetchingCabs, setIsFetchingCabs] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckAvailableCabs = async () => {
    setIsFetchingCabs(true);
    try {
      const response = await fetch("https://rely-cabs.onrender.com/api/bookings/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch available cabs");
      }
      const data = await response.json();
      setAvailableCabs(data.availableCabsWithRates);
    } catch (error) {
      console.error(error);
      setBookingStatus("error");
    } finally {
      setIsFetchingCabs(false);
    }
  };


  const handleCabSelection = (cabId) => {
    setSelectedCab(cabId);
  };

  const handleCreateBooking = async () => {
    try {
      const response = await fetch(
        "https://rely-cabs.onrender.com/api/bookings/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            cabId: selectedCab,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("No cabs available for booking. Please try again later.");
      } else {
        setBookingStatus("success"); // Set booking status to success
        setTimeout(() => setBookingStatus(null), 5000); // Reset status after 5 seconds
      }
      // Handle success
    } catch (error) {
      console.error(error);
      setBookingStatus("error"); // Set booking status to error
      setTimeout(() => setBookingStatus(null), 5000); // Reset status after 5 seconds
      // Handle error
      // Show toast notification for booking error
      setBookingStatus("error");
    }
  };


  const alphabetOptions = ["A", "B", "C", "D", "E", "F"];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="input input-bordered mb-4"
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
        />
        <input
          className="input input-bordered mb-4"
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your Email"
        />
        <select
          className="input input-bordered mb-4"
          id="source"
          name="source"
          value={formData.source}
          onChange={handleChange}
        >
          <option value="">Select Source</option>
          {alphabetOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select
          className="input input-bordered mb-4"
          id="destination"
          name="destination"
          value={formData.destination}
          onChange={handleChange}
        >
         {alphabetOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <input
          className="input input-bordered mb-4"
          id="startTime"
          type="text"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          placeholder="Start Time"
        />
        <input
          className="input input-bordered mb-4"
          id="date"
          type="date" // Add date input type
          name="date"
          value={formData.date}
          onChange={handleChange}
          placeholder="Date"
        />
      </div>
      <button
        className="btn btn-primary w-full"
        type="button"
        onClick={handleCheckAvailableCabs}
        disabled={isFetchingCabs}
      >
        {isFetchingCabs ? "Checking..." : "Check Available Cabs"}
      </button>
      {/* Available cabs and book now button */}
      {availableCabs.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2">Available Cabs with Rates</h3>
          <select
            value={selectedCab}
            onChange={(e) => handleCabSelection(e.target.value)}
            className="input input-bordered mb-4"
          >
            <option value="">Select a Cab</option>
            {availableCabs.map((cab) => (
              <option key={cab._id} value={cab._id}>
                {cab.name} - Rs. {cab.rate}
              </option>
            ))}
          </select>

          {selectedCab && (
            <div className="flex justify-end mt-2">
              <button
                className="btn btn-primary"
                type="button"
                onClick={handleCreateBooking}
              >
                Book Now
              </button>
            </div>
          )}
        </div>
      )}
      {/* Toast notifications */}
      {bookingStatus === "success" && (
        <div className="toast toast-top toast-end">
          <div className="alert alert-success">
            <span>Booking Created Successfully.</span>
          </div>
        </div>
      )}
      {bookingStatus === "error" && (
        <div className="toast toast-top toast-end">
          <div className="alert alert-error">
            <span>
              No cabs available for booking. Please try again later.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Booking;