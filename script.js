// Initialize map and set view to a default location
const map = L.map('map').setView([20, 0], 2); // World view to start

// Add satellite map layer from Mapbox
L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=sk.eyJ1IjoiZGV2ZHV0dDAzIiwiYSI6ImNtM2JyaWp5ejFydjAycXF4NHM1bHptMmMifQ.i6yTVvdvB2M5XyzI7K5ezw', {
    attribution: '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> contributors',
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);

let userMarker, driverMarker;

// Custom car icon
const carIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/481/481200.png', // Car icon URL
    iconSize: [32, 32], // Size of the icon
    iconAnchor: [16, 32], // Anchor point
    popupAnchor: [0, -32] // Popup anchor point
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
    const driverLat = userLocation.lat + (Math.random() * 0.02 - 0.01);
    const driverLng = userLocation.lng + (Math.random() * 0.02 - 0.01);

    if (driverMarker) map.removeLayer(driverMarker);

    driverMarker = L.marker([driverLat, driverLng], { icon: carIcon }).addTo(map)
        .bindPopup("Driver is nearby").openPopup();

    document.getElementById('driver-info').innerText = "Driver assigned and en route!";
}

// Reference the alcohol level node in Firebase
const alcoholLevelRef = db.ref('alcoholLevel');
const threshold = 500;  // Set a threshold for notifications

// Fetch and display alcohol level
function checkAlcoholLevel() {
    alcoholLevelRef.once('value').then(snapshot => {
        const alcoholLevel = snapshot.val();
        document.getElementById('alcohol-value').innerText = `Level: ${alcoholLevel}`;

        if (alcoholLevel > threshold) {
            document.getElementById('alcohol-message').innerText = "Warning: High Alcohol Level!";
            sendNotification("High Alcohol Level Detected! Ride not allowed.");
        } else {
            document.getElementById('alcohol-message').innerText = "Alcohol Level Normal. Ride can proceed.";
        }
    });
}

// Send a browser notification
function sendNotification(message) {
    if (Notification.permission === "granted") {
        new Notification("DMCabs Services", { body: message });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification("DMCabs Services", { body: message });
            }
        });
    }
}

// Request notification permission on page load
document.addEventListener('DOMContentLoaded', () => {
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }
});
