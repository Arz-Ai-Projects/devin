import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Polyline } from '@react-google-maps/api';
import { Search, Navigation, MapPin, Bus, Clock, ArrowRight, Star, X, Menu, AlertCircle } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 24.4539,
  lng: 54.3773
};

const libraries = ['places'];

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const App = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "YOUR_GOOGLE_MAPS_API_KEY",
    libraries
  });

  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [stops, setStops] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedStop, setSelectedStop] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [nearbyStops, setNearbyStops] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ routes: [], stops: [] });
  const [stopTimings, setStopTimings] = useState(null);
  const [loadingTimings, setLoadingTimings] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [error, setError] = useState(null);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/stops`)
      .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch stops'))
      .then(data => setStops(data))
      .catch(err => setError(err));

    fetch(`${API_BASE_URL}/api/routes`)
      .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch routes'))
      .then(data => setRoutes(data))
      .catch(err => setError(err));

    const savedFavs = JSON.parse(localStorage.getItem('busFavs') || '[]');
    setFavorites(savedFavs);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(pos);
          fetchNearbyStops(pos.lat, pos.lng);
        },
        () => fetchNearbyStops(center.lat, center.lng)
      );
    } else {
        fetchNearbyStops(center.lat, center.lng);
    }
  }, []);

  useEffect(() => {
      if (searchQuery.length > 1) {
          fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(searchQuery)}`)
            .then(res => res.json())
            .then(data => setSearchResults(data))
            .catch(err => console.error("Search error:", err));
      } else {
          setSearchResults({ routes: [], stops: [] });
      }
  }, [searchQuery]);

  const fetchNearbyStops = (lat, lon) => {
    fetch(`${API_BASE_URL}/api/nearby?lat=${lat}&lon=${lon}&radius=2`)
      .then(res => res.json())
      .then(data => setNearbyStops(data))
      .catch(err => console.error("Error fetching nearby stops:", err));
  };

  const handleStopClick = (stop) => {
    setSelectedStop(stop);
    setLoadingTimings(true);
    fetch(`${API_BASE_URL}/api/timings/${stop.id}`)
      .then(res => res.json())
      .then(data => {
        setStopTimings(data);
        setLoadingTimings(false);
      })
      .catch(() => setLoadingTimings(false));
  };

  const handleRouteSelect = (route) => {
    fetch(`${API_BASE_URL}/api/route/${route.id}`)
      .then(res => res.json())
      .then(data => {
        setSelectedRoute(data);
        if (data.stopDetails?.length > 0) {
          const firstStop = data.stopDetails[0];
          map?.panTo({ lat: firstStop.lat, lng: firstStop.lon });
          map?.setZoom(14);
        }
      });
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const toggleFavorite = (stop) => {
    let newFavs = favorites.some(f => f.id === stop.id)
        ? favorites.filter(f => f.id !== stop.id)
        : [...favorites, stop];
    setFavorites(newFavs);
    localStorage.setItem('busFavs', JSON.stringify(newFavs));
  };

  const getDirections = (stop) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${stop.lat},${stop.lon}&travelmode=walking`;
    window.open(url, '_blank');
  };

  if (loadError) {
      return <div className="h-screen flex items-center justify-center bg-red-50 text-red-600 p-10 text-center">
          <div>
            <AlertCircle size={48} className="mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Map Load Error</h2>
            <p>Could not initialize Google Maps. Please check your API key.</p>
          </div>
      </div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans text-gray-900">
      <header className="bg-blue-700 text-white p-4 shadow-lg flex justify-between items-center z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden p-1 hover:bg-blue-600 rounded">
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Bus size={24} className="text-blue-200" /> Abu Dhabi Bus
          </h1>
        </div>
        <button
            onClick={() => userLocation && map?.panTo(userLocation)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-full transition text-sm font-medium shadow-md"
        >
            <Navigation size={16} /> <span className="hidden sm:inline">My Location</span>
        </button>
      </header>

      <main className="flex flex-1 overflow-hidden relative">
        <div className={`
          absolute md:relative inset-y-0 left-0 w-80 bg-white shadow-2xl z-30 transform transition-transform duration-300 ease-in-out flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:hidden'}
        `}>
          <div className="p-4 border-b space-y-4">
            <div className="flex justify-between items-center md:hidden">
                <span className="font-bold text-gray-400 uppercase text-xs tracking-widest">Navigation</span>
                <button onClick={() => setIsSidebarOpen(false)} className="p-1 hover:bg-gray-100 rounded text-gray-400"><X size={20}/></button>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Route number or place..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {searchQuery.length > 1 && (
              <div className="p-4 border-b space-y-6 bg-blue-50/30">
                <div>
                    <h2 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest flex items-center gap-2">
                        <Bus size={12}/> Routes
                    </h2>
                    {searchResults.routes.length > 0 ? (
                    <div className="space-y-2">
                        {searchResults.routes.map(route => (
                        <button
                            key={route.id}
                            onClick={() => handleRouteSelect(route)}
                            className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between bg-white ${selectedRoute?.id === route.id ? 'border-blue-500 ring-1 ring-blue-500 shadow-md' : 'border-gray-100 hover:border-blue-200 shadow-sm'}`}
                        >
                            <div>
                                <div className="font-black text-blue-700 text-lg leading-tight">{route.ref}</div>
                                <div className="text-[10px] text-gray-500 truncate max-w-[180px]">{route.name}</div>
                            </div>
                            <ArrowRight size={16} className="text-blue-300" />
                        </button>
                        ))}
                    </div>
                    ) : <div className="text-xs text-gray-400 italic px-1">No routes found</div>}
                </div>

                <div>
                    <h2 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest flex items-center gap-2">
                        <MapPin size={12}/> Stops & Places
                    </h2>
                    {searchResults.stops.length > 0 ? (
                        <div className="space-y-2">
                            {searchResults.stops.map(stop => (
                                <button
                                    key={`search-stop-${stop.id}`}
                                    onClick={() => { handleStopClick(stop); map?.panTo({ lat: stop.lat, lng: stop.lon }); map?.setZoom(16); }}
                                    className="w-full text-left p-3 rounded-xl border border-gray-100 bg-white hover:border-blue-200 transition shadow-sm"
                                >
                                    <div className="font-bold text-sm text-gray-700 leading-tight">{stop.name_en}</div>
                                    <div className="text-[9px] text-gray-400 mt-1 uppercase font-bold flex gap-1">
                                        {stop.routes.slice(0, 5).join(', ')}
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : <div className="text-xs text-gray-400 italic px-1">No stops found</div>}
                </div>
              </div>
            )}

            {favorites.length > 0 && !searchQuery && (
                <div className="p-4 border-b">
                    <h2 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest flex items-center gap-2">
                        <Star size={12}/> Favorites
                    </h2>
                    <div className="space-y-2">
                        {favorites.map(stop => (
                            <button
                                key={`fav-${stop.id}`}
                                onClick={() => { handleStopClick(stop); map?.panTo({ lat: stop.lat, lng: stop.lon }); map?.setZoom(16); }}
                                className="w-full text-left p-3 rounded-xl bg-yellow-50 border border-yellow-100 flex items-center justify-between shadow-sm hover:shadow-md transition"
                            >
                                <div className="truncate pr-2">
                                    <div className="font-bold text-sm text-yellow-800 truncate">{stop.name_en}</div>
                                    <div className="text-[10px] text-yellow-600 font-medium">{stop.routes.join(', ')}</div>
                                </div>
                                <Star size={16} className="text-yellow-500 fill-yellow-500 shrink-0" />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="p-4">
              <h2 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest flex items-center gap-2">
                <Navigation size={12}/> Nearby Stops
              </h2>
              <div className="space-y-3">
                {nearbyStops.length > 0 ? (
                  nearbyStops.slice(0, 15).map(stop => (
                    <div
                      key={stop.id}
                      className={`group w-full text-left p-3 rounded-xl border transition relative bg-white ${selectedStop?.id === stop.id ? 'border-green-500 ring-1 ring-green-500 shadow-md' : 'border-gray-100 hover:border-gray-200 shadow-sm'}`}
                    >
                      <div onClick={() => { handleStopClick(stop); map?.panTo({ lat: stop.lat, lng: stop.lon }); map?.setZoom(16); }} className="cursor-pointer">
                        <div className="font-bold text-sm flex items-start gap-2 pr-6">
                            <MapPin size={16} className="text-red-500 shrink-0 mt-0.5" />
                            <span className="leading-tight">{stop.name_en}</span>
                        </div>
                        <div className="text-[10px] text-gray-500 mt-2 flex justify-between items-center">
                            <div className="flex gap-1 flex-wrap">
                                {stop.routes.slice(0, 3).map(r => <span key={r} className="bg-gray-100 px-1.5 py-0.5 rounded font-bold text-gray-600">{r}</span>)}
                                {stop.routes.length > 3 && <span className="text-[9px] text-gray-400 font-bold">+{stop.routes.length - 3}</span>}
                            </div>
                            <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full shadow-sm">{(stop.distance * 1000).toFixed(0)}m</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(stop); }}
                        className="absolute top-3 right-3 text-gray-200 hover:text-yellow-500 transition"
                      >
                        <Star size={18} className={favorites.some(f => f.id === stop.id) ? "fill-yellow-500 text-yellow-500" : ""} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-400 py-10 text-center italic border-2 border-dashed border-gray-100 rounded-xl">
                    <Navigation className="mx-auto mb-2 text-gray-200 animate-pulse" size={32} />
                    Calculating nearby stops...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 relative z-10 bg-gray-200">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={13}
              onLoad={onLoad}
              onUnmount={onUnmount}
              options={{
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                zoomControlOptions: { position: 3 },
                styles: [{ "featureType": "poi", "elementType": "labels", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }]
              }}
            >
              {userLocation && (
                <Marker
                  position={userLocation}
                  icon={{ path: window.google.maps.SymbolPath.CIRCLE, fillColor: '#3b82f6', fillOpacity: 1, strokeWeight: 2, strokeColor: '#ffffff', scale: 7 }}
                />
              )}

              {selectedRoute?.stopDetails && (
                <>
                    <Polyline
                    path={selectedRoute.stopDetails.map(s => ({ lat: s.lat, lng: s.lon }))}
                    options={{ strokeColor: '#2563eb', strokeOpacity: 0.8, strokeWeight: 5 }}
                    />
                    {selectedRoute.stopDetails.map(stop => (
                        <Marker
                        key={`route-stop-${stop.id}`}
                        position={{ lat: stop.lat, lng: stop.lon }}
                        onClick={() => handleStopClick(stop)}
                        icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png', scaledSize: new window.google.maps.Size(24, 24) }}
                        />
                    ))}
                </>
              )}

              {selectedStop && (
                <InfoWindow
                  position={{ lat: selectedStop.lat, lng: selectedStop.lon }}
                  onCloseClick={() => setSelectedStop(null)}
                >
                  <div className="p-3 min-w-[220px] max-w-xs text-gray-800">
                    <div className="flex justify-between items-start mb-2 gap-2 border-b pb-2">
                        <h3 className="font-black text-blue-700 leading-tight pr-4">{selectedStop.name_en}</h3>
                        <button onClick={() => toggleFavorite(selectedStop)}>
                            <Star size={16} className={favorites.some(f => f.id === selectedStop.id) ? "fill-yellow-500 text-yellow-500" : "text-gray-300"} />
                        </button>
                    </div>

                    {loadingTimings ? (
                      <div className="flex items-center justify-center py-4 text-blue-500 animate-pulse">
                        <Clock size={20} className="mr-2" /> <span className="text-sm font-bold uppercase tracking-tight">Updating...</span>
                      </div>
                    ) : stopTimings ? (
                      <div className="space-y-1.5 max-h-40 overflow-y-auto">
                        {stopTimings.timings.length > 0 ? (
                          stopTimings.timings.map((t, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-gray-50 px-2.5 py-2 rounded-lg border border-gray-100">
                              <div className="flex flex-col">
                                <span className="font-black text-gray-800 leading-none">{t.route}</span>
                                <span className="text-[8px] text-gray-400 uppercase font-bold mt-1">Scheduled</span>
                              </div>
                              <div className="text-right">
                                <span className={`text-sm font-black ${t.minutesAway < 5 ? 'text-red-500' : 'text-green-600'}`}>
                                    {t.minutesAway} <span className="text-[9px] font-bold">MINS</span>
                                </span>
                              </div>
                            </div>
                          ))
                        ) : <div className="text-[10px] text-gray-400 italic py-2 text-center">No upcoming arrivals</div>}
                      </div>
                    ) : null}

                    <div className="mt-4 grid grid-cols-2 gap-2">
                        <button onClick={() => getDirections(selectedStop)} className="bg-blue-600 text-white text-[10px] font-black py-2.5 px-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-1 shadow-sm">
                            DIRECTIONS <ArrowRight size={12} />
                        </button>
                        <button className="bg-gray-100 text-gray-500 text-[10px] font-black py-2.5 px-3 rounded-lg hover:bg-gray-200 transition flex items-center justify-center">
                            STREET VIEW
                        </button>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-gray-400">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4 shadow-sm"></div>
                <p className="font-bold text-sm tracking-tight text-gray-500">Abu Dhabi Transit Map</p>
                <p className="text-[10px] mt-1 uppercase tracking-widest font-medium text-gray-300">Establishing Connection</p>
            </div>
          )}
        </div>
      </main>

      {isSidebarOpen && (
          <div className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-[2px] z-25 transition-opacity" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  );
};

export default App;
