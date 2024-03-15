# Cab System Web Application

This project is a web application for managing a cab system. It allows users to book cabs by providing their source and destination, calculates the shortest time and estimated cost for the journey, and tracks cab bookings. The system also provides administrators the ability to manage cabs and their pricing.

## Requirements

- Manage cab booking
- Calculate shortest time and estimated cost for journeys
- Provide a user interface for booking cabs
- Track cab bookings
- Admin interface for managing cabs and pricing
- Implementing the "Dijkstra's Algorithm" for the shortest path selection

## Usage

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your_username/cab-system.git
   ```

2. Install dependencies:

   ```bash
   cd cab-system
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Access the application at `http://localhost:3000` in your web browser.

### Functionality

1. **Booking a Cab:**
   - Enter the source and destination locations.
   - Provide your email for booking confirmation.

2. **Calculating Shortest Time and Cost:**
   - The system calculates the shortest route and estimates the cost based on the selected cab's pricing.

3. **Tracking Cab Bookings:**
   - The system tracks all cab bookings and provides an overview for administrators.

4. **Managing Cabs and Pricing:**
   - Administrators can view and edit cab details, including pricing.

### Deployment

The application can be deployed using AWS, Heroku, or any other suitable service. Simply follow the deployment instructions provided by the chosen platform.

## Database Schema

The database schema includes tables for users, bookings, cabs, and pricing information.

## Good to Have

- Responsive Design: The application is designed to be responsive across various devices.
- Email Notifications: The system sends email notifications to users upon booking confirmation.

## Evaluation Criteria

- Basic functionality working as described in the Requirements section.
- Database schema design.
- Code Modularity and quality.

## Note

- No login/signup pages are included, assuming only administrators will access the system.
- The frontend is developed as a Single Page Application (SPA) for a seamless user experience.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

