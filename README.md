# Abu Dhabi Bus Tracker

A web application to track bus timings and find routes in Abu Dhabi.

## Features

- **Search:** Find bus timings by route number or search for nearby stops by place name.
- **Nearby Stops:** Automatically detects your location and shows the nearest bus stops with walking distances.
- **Interactive Map:** View bus stops and full route paths on a Google Map.
- **Real-time/Scheduled Timings:** View upcoming bus arrivals for any selected stop.
- **Favorites:** Save your most-used stops for quick access.
- **Responsive Design:** Optimized for both mobile and desktop use.

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Google Maps API (@react-google-maps/api).
- **Backend:** Node.js, Express.
- **Data Source:** OpenStreetMap (Overpass API).

## Getting Started

### Prerequisites

- Node.js (v18+)
- Google Maps API Key

### Installation

1.  Clone the repository.
2.  Install backend dependencies:
    ```bash
    cd server
    npm install
    ```
3.  Install frontend dependencies:
    ```bash
    cd ../client
    npm install
    ```

### Configuration

Create a `.env` file in the `client` directory:
```env
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### Running the Application

1.  Build the frontend:
    ```bash
    cd client
    npm run build
    ```
2.  Start the backend server:
    ```bash
    cd ../server
    node index.js
    ```
3.  Access the application at `http://localhost:5000`.

## Project Structure

- `client/`: React frontend application.
- `server/`: Express backend and transit data (`data.json`).
- `server/data.json`: Processed bus stops and routes for Abu Dhabi.
