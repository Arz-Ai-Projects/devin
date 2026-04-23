const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Load data
const dataPath = path.join(__dirname, 'data.json');
let transitData = { stops: [], routes: [] };

try {
  const rawData = fs.readFileSync(dataPath, 'utf8');
  transitData = JSON.parse(rawData);
} catch (error) {
  console.error("Error loading transit data:", error);
}

// API Endpoints
app.get('/api/stops', (req, res) => {
  res.json(transitData.stops);
});

app.get('/api/routes', (req, res) => {
  res.json(transitData.routes);
});

app.get('/api/search', (req, res) => {
    const { q } = req.query;
    if (!q) return res.json({ stops: [], routes: [] });

    const query = q.toLowerCase();
    const filteredRoutes = transitData.routes.filter(r =>
        r.ref.toLowerCase().includes(query) || r.name.toLowerCase().includes(query)
    ).slice(0, 5);

    const filteredStops = transitData.stops.filter(s =>
        s.name_en.toLowerCase().includes(query)
    ).slice(0, 10);

    res.json({ routes: filteredRoutes, stops: filteredStops });
});

app.get('/api/route/:id', (req, res) => {
  const route = transitData.routes.find(r => r.id === parseInt(req.params.id));
  if (route) {
    const stops = route.stops.map(stopId => transitData.stops.find(s => s.id === stopId)).filter(Boolean);
    res.json({ ...route, stopDetails: stops });
  } else {
    res.status(404).json({ error: 'Route not found' });
  }
});

app.get('/api/nearby', (req, res) => {
  const { lat, lon, radius = 2 } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  const userLat = parseFloat(lat);
  const userLon = parseFloat(lon);

  const nearbyStops = transitData.stops
    .map(stop => ({
      ...stop,
      distance: getDistance(userLat, userLon, stop.lat, stop.lon)
    }))
    .filter(stop => stop.distance <= parseFloat(radius))
    .sort((a, b) => a.distance - b.distance);

  res.json(nearbyStops);
});

app.get('/api/timings/:stopId', (req, res) => {
  const stopId = parseInt(req.params.stopId);
  const stop = transitData.stops.find(s => s.id === stopId);

  if (!stop) {
    return res.status(404).json({ error: 'Stop not found' });
  }

  const now = new Date();
  const timings = [];
  const routesServingStop = stop.routes.length > 0 ? stop.routes : ['Service 1'];

  routesServingStop.forEach(routeRef => {
    for (let i = 1; i <= 3; i++) {
      const arrivalTime = new Date(now.getTime() + (i * 15 + Math.floor(Math.random() * 10)) * 60000);
      timings.push({
        route: routeRef,
        arrivalTime: arrivalTime.toISOString(),
        minutesAway: Math.round((arrivalTime - now) / 60000)
      });
    }
  });

  res.json({
    stopId,
    stopName: stop.name_en,
    timings: timings.sort((a, b) => a.minutesAway - b.minutesAway)
  });
});

// Helper functions
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Serve static files
app.use(express.static(path.join(__dirname, '../client/dist')));

// Fallback for SPA
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api') && !path.extname(req.path)) {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  } else {
    next();
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
