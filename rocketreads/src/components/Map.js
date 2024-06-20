import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

const Map = () => {
    const [launchpads, setLaunchpads] = useState([]);

    useEffect(() => {
        const fetchLaunchpads = async () => {
            try {
                const result = await axios.get('https://api.spacexdata.com/v4/launchpads');
                const formattedLaunchpads = result.data.map(launchpad => ({
                    name: launchpad.name,
                    latitude: launchpad.latitude,
                    longitude: launchpad.longitude,
                    launchAttempts: launchpad.launch_attempts,
                    launchSuccesses: launchpad.launch_successes
                }));
                setLaunchpads(formattedLaunchpads);
            } catch (error) {
                console.error('Error fetching launchpad data:', error);
            }
        };

        fetchLaunchpads();
    }, []);

    return (
        <div>
            <div className="timelines-header">
                
                <h1>Map</h1>
                <p>View successful vs unsuccessful launches at launch sites visually.</p>
            </div>
            <MapContainer center={[20, 0]} zoom={2} style={{ height: "80vh", width: "75vw", marginRight: "30px" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {launchpads.map((launchpad, index) => {
                    const unsuccessfulLaunches = launchpad.launchAttempts - launchpad.launchSuccesses;
                    return (
                        <React.Fragment key={index}>
                            <Circle
                                center={[launchpad.latitude, launchpad.longitude]}
                                radius={launchpad.launchSuccesses * 15000}
                                color="green"
                                fillColor="green"
                                fillOpacity={0.4}
                            >
                                <Popup>
                                    {launchpad.name}<br />Successful Launches: {launchpad.launchSuccesses}
                                    <br />Unsuccessful Launches: {unsuccessfulLaunches}
                                </Popup>
                            </Circle>
                            <Circle
                                center={[launchpad.latitude, launchpad.longitude]}
                                radius={unsuccessfulLaunches * 15000}
                                color="red"
                                fillColor="red"
                                fillOpacity={0.4}
                            >
                                <Popup>
                                    {launchpad.name}<br />Successful Launches: {launchpad.launchSuccesses}
                                    <br />Unsuccessful Launches: {unsuccessfulLaunches}
                                    
                                </Popup>
                            </Circle>
                        </React.Fragment>
                    );
                })}
            </MapContainer>
        </div>
        
    );
};

export default Map;
