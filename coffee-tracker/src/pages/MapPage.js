import { GoogleMap, Marker, LoadScriptNext, InfoWindow } from '@react-google-maps/api';
import { GOOGLE_PLACES_API_KEY } from '../keys';
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const containerStyle = {
  width: '100%',
  height: '600px',
};

const MapPage = () => {
  const [coffeeShops, setCoffeeShops] = useState([]);
  const [goToPlaces, setGoToPlaces] = useState([]);
  const [userLocation, setUserLocation] = useState(null); 
  const [selectedShop, setSelectedShop] = useState(null);
  const [goToShop, setGoToShop] = useState(null);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const coffeeShopsSnapshot = await getDocs(collection(db, 'coffeeShops'));
        const goToPlacesSnapshot = await getDocs(collection(db, 'goToPlaces'));
        console.log("Got CoffeeShops");

        setCoffeeShops(
          coffeeShopsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );

        setGoToPlaces(
          goToPlacesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );

      } catch (error) {
        console.error('Error fetching data from Firebase:', error);
      }
    };

    fetchData();


    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          console.log("Got User Loc");
        },

        (error) => {
          console.error('Error getting user location:', error);
          
          
          setUserLocation({ lat: 47.663399, lng: -122.313911 }); // Fallback location, my apartment 
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setUserLocation({ lat: 47.663399, lng: -122.313911 });
    }
  }, []);

  return (
    <LoadScriptNext googleMapsApiKey={GOOGLE_PLACES_API_KEY}>
      <div>
        <h1>Where I've Been 🗺️</h1>
          <GoogleMap mapContainerStyle={containerStyle} center={userLocation} zoom={12}>

            {coffeeShops.map((shop) => (
              <Marker
                key={shop.id}
                position={{ lat: shop.lat, lng: shop.lng }}
                icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png" 
                title={`Coffee Shop: ${shop.name}`}
                onClick={() => setSelectedShop(shop)} 
              />
            ))}

            {goToPlaces.map((place) => (
              <Marker
                key={place.id}
                position={{ lat: place.lat, lng: place.lng }}
                icon="http://maps.google.com/mapfiles/ms/icons/orange-dot.png" 
                title={`Go-To: ${place.name}`}
                onClick={() => setGoToShop(place)}
              />
            ))}


            {userLocation && (
              <Marker
                position={userLocation}
                icon="http://maps.google.com/mapfiles/ms/icons/ltblue-dot.png"  
                title="You are here"
              />
            )}

            {selectedShop && (
              <InfoWindow
                position={{ lat: selectedShop.lat, lng: selectedShop.lng }}
                onCloseClick={() => setSelectedShop(null)} 
              >
                <div>
                  <h3>{selectedShop.name}</h3>
                  <p>{selectedShop.address}</p>
                  <p>Rating: {selectedShop.rating}</p>
                  <p>Price: ${selectedShop.price}</p>
                  <p>Items Got: {selectedShop.items}</p>
                </div>
              </InfoWindow>
            )}


            {goToShop && (
              <InfoWindow
                position={{ lat: goToShop.lat, lng: goToShop.lng }}
                onCloseClick={() => setGoToShop(null)} 
              >
                <div>
                  <h3>{goToShop.name}</h3>
                  <p>{goToShop.address}</p>
                </div>
              </InfoWindow>
            )}

          </GoogleMap>


          <div className="table-container">
            <table>

              <thead>
                <tr>
                  <th>Places I Have Been <img src="https://maps.google.com/mapfiles/ms/icons/blue-dot.png" alt=" || Blue Pin"></img></th>
                  <th>Places I Want to Go <img src="https://maps.google.com/mapfiles/ms/icons/orange-dot.png" alt="|| Orange Pin"></img></th>
                </tr>
              </thead>

              <tbody>
                {Array(Math.max(coffeeShops.length, goToPlaces.length))
                  .fill(null)
                  .map((_, idx) => (
                    <tr key={idx}>
                      <td>{coffeeShops[idx]?.name || ''}</td>
                      <td>{goToPlaces[idx]?.name || ''}</td>
                    </tr>
                  ))}
              </tbody>
              
            </table>
          </div>
        
      </div>
    </LoadScriptNext>

  );
};

export default MapPage;
