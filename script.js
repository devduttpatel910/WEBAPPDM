document.addEventListener("DOMContentLoaded", () => {
    // Initialize map and set view to a default location.
    const map = L.map('map').setView([20, 0], 2); // World view to start

    // Add satellite map layer from Mapbox
    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=sk.eyJ1IjoiZGV2ZHV0dDAzIiwiYSI6ImNtM2JyaWp5ejFydjAycXF4NHM1bHptMmMifQ.i6yTVvdvB2M5XyzI7K5ezw', {
        attribution: '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> contributors',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(map);

    let userMarker, driverMarker;

    // Car icon setup
    const carIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/1995/1995470.png', // Light-colored car icon
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });

    // Existing findUserLocation and simulateDriverLocation functions...
});

// Function to find and display user's location
function findUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

            // Remove old user marker if it exists
            if (userMarker) map.removeLayer(userMarker);

            // Add user marker
            userMarker = L.marker([userLat, userLng]).addTo(map)
                .bindPopup("You are here").openPopup();
            
            // Center map to user's location
            map.setView([userLat, userLng], 14);
        }, error => {
            // Improved error messages based on error codes
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    alert("User denied the request for Geolocation.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    alert("Location information is unavailable.");
                    break;
                case error.TIMEOUT:
                    alert("The request to get user location timed out.");
                    break;
                default:
                    alert("An unknown error occurred.");
                    break;
            }
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Function to simulate driver location near the user
function simulateDriverLocation() {
    if (!userMarker) {
        alert("Find your location first!");
        return;
    }

    const userLocation = userMarker.getLatLng();
    
    if (!userLocation) {
        alert("Error: Unable to retrieve user location.");
        return;
    }

    const driverLat = userLocation.lat + (Math.random() * 0.02 - 0.01);
    const driverLng = userLocation.lng + (Math.random() * 0.02 - 0.01);

    // Remove old driver marker if it exists
    if (driverMarker) map.removeLayer(driverMarker);

    // Add driver marker with the custom car icon
    driverMarker = L.marker([driverLat, driverLng], { icon: carIcon }).addTo(map)
        .bindPopup("Driver is nearby").openPopup();
}
