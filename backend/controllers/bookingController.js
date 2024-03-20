import User from "../models/user.js";
import findShortestPath from "../dijkstra.js";
import Cab from "../models/cab.js";
import Booking from "../models/booking.js";
import moment from "moment";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

// Function to check if a cab is booked for a given time range
const checkCab = async (cabId, startTime, endTime) => {
  try {
    const bookings = await Booking.find({
      cab: cabId,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    });
    return bookings.length > 0;
  } catch (err) {
    console.error(err);
    throw new Error("Error checking cab booking status");
  }
};

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

// Function to send email confirmation
const sendMail = async (transporter, mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
  } catch (error) {
    console.error(error);
  }
}

// Function to create a booking
const createBooking = async (req, res) => {
  try {
    const { name, email, source, destination, startTime, cabId, date } = req.body;

    // Validating input data
    if (!name || !email || !source || !destination || !startTime || !cabId || !date) {
      return res.status(400).json({ message: "Please fill all the details" });
    }

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email });
    }

    // Find shortest path
    const { path: shortestPath, duration } = await findShortestPath(
      source,
      destination
    );

    // Validating shortest path
    if (!shortestPath) {
      return res.status(400).json({ message: "Unable to find path" });
    }

    // Check cab availability
    const chosenCab = await Cab.findById(cabId);
    if (!chosenCab) {
      return res.status(404).json({ message: "Cab not found" });
    }

    // Calculating start and end times
    const combinedDateTime = moment(`${date} ${startTime}`, "YYYY-MM-DD h:mm A");
    const endTime = combinedDateTime.clone().add(duration, "minutes").format("YYYY-MM-DD h:mm A");

    // Check if cab is booked
    const cabBooked = await checkCab(cabId, combinedDateTime.format("YYYY-MM-DD h:mm A"), endTime);
    if (cabBooked) {
      return res.status(400).json({ message: "Cab is already booked." });
    }

    // Calculate amount
    const amount = chosenCab.pricePerMinute * duration;

    // Create the booking
    const booking = new Booking({
      user: user._id,
      cab: chosenCab._id,
      source,
      destination,
      startTime: combinedDateTime.format("YYYY-MM-DD h:mm A"),
      endTime,
      amount,
    });
    await booking.save();

    const emailHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ride Confirmation</title>
  <style>
    body{font-family:Arial,sans-serif;background-color:#f4f4f4;padding:20px}
    .container{max-width:600px;margin:0 auto;background-color:#fff;border-radius:8px;padding:40px}
    h1{color:#333}
    p{margin-bottom:10px;color:#666}
    .icon{display:inline-block;vertical-align:middle;margin-right:10px}
    .info-container{margin-top:20px;border-top:1px solid #ccc;padding-top:20px}
    .amount{font-size:18px;color:#f60;font-weight:bold}
  </style>
</head>
<body>
  <div class="container">
    <h1><span class="icon">🚗</span>Ride Confirmation</h1>
    <p>Thank you for booking your ride with us. Here are the details:</p>
    <p><strong>From:</strong> ${source}</p>
    <p><strong>To:</strong> ${destination}</p>
    <p><strong>Departure Time:</strong> ${combinedDateTime.format("YYYY-MM-DD h:mm A")}</p>
    <p><strong>Arrival Time:</strong> ${endTime}</p>
    <div class="info-container">
      <p><strong>Vehicle:</strong> ${chosenCab.name}</p>
      <p><strong>Amount Due:</strong> <span class="amount">Rs.${amount}</span></p>
    </div>
  </div>
</body>
</html>
`;



    const mailOptions = {
      from: {
        name: "RelyCabs",
        address: process.env.USER,
      }, // sender address
      to: email, // list of receivers
      subject: "Ride Confirmation",
      text: "Your ride has been confirmed by RelyCabs.",
      html: emailHTML,
    };

    await sendMail(transporter, mailOptions);

    // Respond with success message and booking details
    res.status(201).json({ message: "Ride booked successfully", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Function to check booking availability
const checkBooking = async (req, res) => {
  try {
    const { name, email, source, destination, startTime, date } = req.body;

    // Validating input data
    if (!name || !email || !source || !destination || !startTime || !date) {
      return res.status(400).json({ message: "Booking details are incomplete" });
    }

    // Parse date and start time
    const combinedDateTime = moment(`${date} ${startTime}`, "YYYY-MM-DD h:mm A");

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email });
    }

    // Find shortest path
    const shortestPath = await findShortestPath(source, destination);

    // Validating shortest path
    if (!shortestPath) {
      return res.status(400).json({ message: "Unable to find the shortest path" });
    }

    // Calculate end time
    const endTime = combinedDateTime.clone().add(shortestPath.duration, "minutes").format("YYYY-MM-DD h:mm A");

    // Find available cabs
    const availableCabs = await Cab.find();

    // Check cab availability
    const availableCabsWithRates = [];
    let noAvailableCabs = true;
    for (const cab of availableCabs) {
      const cabAvailable = await checkCab(
        cab._id,
        combinedDateTime.format("YYYY-MM-DD h:mm A"),
        endTime
      );
      if (!cabAvailable) {
        noAvailableCabs = false;
        const rate = cab.pricePerMinute * shortestPath.duration;
        availableCabsWithRates.push({ _id: cab._id, name: cab.name, rate });
      }
    }

    // Respond with available cabs and rates
    if (noAvailableCabs) {
      return res.status(400).json({ message: "No cabs available" });
    }
    res.json({ endTime, availableCabsWithRates });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};





// Function to retrieve bookings
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user', 'name email').populate('cab');
    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// Function to delete a booking
const deleteBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const deletedBooking = await Booking.findOneAndDelete({ _id: bookingId });
    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json({ message: "Booking removed" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { checkBooking, createBooking, getBookings, deleteBooking };
