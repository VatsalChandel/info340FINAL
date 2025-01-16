import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const Profile = () => {
  const [totalVisits, setTotalVisits] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalSpending, setTotalSpending] = useState(0);
  const [favoriteItem, setFavoriteItem] = useState("Loading...");


  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const coffeeShopsCol = collection(db, "coffeeShops");
        const coffeeShopsSnapshot = await getDocs(coffeeShopsCol);
        const coffeeShops = coffeeShopsSnapshot.docs.map((doc) => doc.data());

        const totalVisits = coffeeShops.length;
        const totalRating = coffeeShops.reduce((sum, shop) => sum + shop.rating, 0);
        const totalSpending = coffeeShops.reduce((sum, shop) => sum + shop.price, 0);

        setTotalVisits(totalVisits);
        setAverageRating(totalVisits > 0 ? (totalRating / totalVisits).toFixed(1) : 0);
        setTotalSpending(totalSpending.toFixed(2));

        const itemFrequency = {};
        coffeeShops.forEach((shop) => {
          if (Array.isArray(shop.items)) {
            shop.items.forEach((item) => {
              itemFrequency[item] = (itemFrequency[item] || 0) + 1;
            });
          }
        });

        const favoriteItem = Object.keys(itemFrequency).reduce((a, b) =>
          itemFrequency[a] > itemFrequency[b] ? a : b
        );

        setFavoriteItem(favoriteItem || "No items found");
        
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <div>
    <h1>About Me ☕</h1>
    <div className="profile-container">
      <p>Total Visits: {totalVisits}</p>
      <p>Average Rating: {averageRating}</p>
      <p>Total Spending: ${totalSpending}</p>
      <p>Favorite Item: {favoriteItem}</p>
    </div>
    </div>
  );
};

export default Profile;
