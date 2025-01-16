import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { GOOGLE_PLACES_API_KEY } from '../keys';
import './Home.css';

const GoToList = () => {
  const [goToPlaces, setGoToPlaces] = useState([]);
  const [newPlace, setNewPlace] = useState('');
  const [editingPlace, setEditingPlace] = useState(null);
  const collectionRef = collection(db, 'goToPlaces');
  const [userLocation, setUserLocation] = useState(null); 

 
  
  useEffect(() => {
    const fetchGoToPlaces = async () => {
      try {

        const querySnapshot = await getDocs(collectionRef);
        const places = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGoToPlaces(places);

      } catch (error) {
        console.error('Error fetching go-to places: ', error);
      }
    };

    fetchGoToPlaces();


    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          console.log("Got User Loc");
        },
        (error) => {
          console.error('Error getting user location:', error);
          
          
          setUserLocation({ lat: 47.663399, lng: -122.313911 }); // Fallback location
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setUserLocation({ lat: 47.663399, lng: -122.313911 }); // Fallback location
    }


  }, []);

  const fetchLocationDetails = async (placeName) => {
    const userLatitude = userLocation.lat; 
    const userLongitude = userLocation.lng; 
    const searchRadius = 16000; // So that users do not get anything from Italy or smth 
  
    const GOOGLE_API_URL = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      placeName
    )}&location=${userLatitude},${userLongitude}&radius=${searchRadius}&key=${GOOGLE_PLACES_API_KEY}`;
  
    try {

      const response = await fetch(GOOGLE_API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const result = data.results[0];
      if (result) {
        return {
          address: result.formatted_address,
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
        };
      } else {
        throw new Error('Location not found');
      }

    } catch (error) {
      console.error('Error fetching location details:', error);
      return null;
    }
  };
  
  

  const addPlace = async () => {
    if (newPlace.trim() === '') {
      alert('Please enter a valid place name.');
      return;
    }

    try {
      const locationDetails = await fetchLocationDetails(newPlace.trim());
      if (locationDetails) {
        const docRef = await addDoc(collectionRef, {
          name: newPlace.trim(),
          ...locationDetails,
        });

        setGoToPlaces([
          ...goToPlaces,
          { id: docRef.id, name: newPlace.trim(), ...locationDetails },
        ]);

        setNewPlace('');

      } else {
        alert('Could not fetch location details. Please try again.');
      }

    } catch (error) {
      console.error('Error adding new place: ', error);
    }
  };

  const updatePlace = async (id, updatedName, updatedAddress) => {
    try {
      const updatedLocation = await fetchLocationDetails(updatedAddress);
      if (!updatedLocation) {
        alert('Could not update location. Please try again.');
        return;
      }

      const placeRef = doc(db, 'goToPlaces', id);
      await updateDoc(placeRef, {
        name: updatedName,
        address: updatedLocation.address,
        lat: updatedLocation.lat,
        lng: updatedLocation.lng,
      });

      setGoToPlaces((prevPlaces) =>
        prevPlaces.map((place) =>
          place.id === id
            ? { ...place, name: updatedName, ...updatedLocation }
            : place
        )
      );

      setEditingPlace(null);
    } catch (error) {
      console.error('Error updating place:', error);
    }
  };

  const deletePlace = async (id) => {
    try {
      const placeRef = doc(db, 'goToPlaces', id);
      await deleteDoc(placeRef);
      setGoToPlaces((prevPlaces) => prevPlaces.filter((place) => place.id !== id));
    } catch (error) {
      console.error('Error deleting place:', error);
    }
  };


  const handleInputChange = (e) => {
    setNewPlace(e.target.value);
  };

  const handleEdit = (place) => {
    setEditingPlace(place);
  };

  return (
    <div>
      <h1>I Wanna Go 🏃‍♂️</h1>

      <ul>
        {goToPlaces.map((place) => (
          <li key={place.id}>
            {editingPlace?.id === place.id ? (
              <>

                <input
                  type="text"
                  value={editingPlace.name}
                  onChange={(e) =>
                    setEditingPlace({ ...editingPlace, name: e.target.value })
                  }
                />

                <input
                  type="text"
                  value={editingPlace.address}
                  onChange={(e) =>
                    setEditingPlace({ ...editingPlace, address: e.target.value })
                  }
                />

                <button
                  onClick={() =>
                    updatePlace(editingPlace.id, editingPlace.name, editingPlace.address)
                  }
                >

                  Save
                </button>
                <button onClick={() => setEditingPlace(null)}>Cancel</button>

              </>
            ) : (
              <>
                <strong>{place.name}</strong>
                <br />
                <em>{place.address}</em>
                <div className="button-group">
                  <button onClick={() => handleEdit(place)}>Edit</button>
                  <button onClick={() => deletePlace(place.id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>



      <div>
        <input
          type="text"
          placeholder="Enter a new place"
          value={newPlace}
          onChange={handleInputChange}
        />
        
        <div className="add-location-container">
        <button className="add-location" onClick={addPlace}>Add Place</button>
        </div>
      </div>

      
    </div>
  );
};

export default GoToList;
