// src/components/DogCard.jsx
import React, { useState, useEffect } from "react";
import "./../styles/DogCard.css";

export default function DogCard() {
  const [dogImage, setDogImage] = useState(null);
  const [dogHeading, setDogHeading] = useState("");

  const dogHeadings = [
    "Paws and Relax: Latest Doggos in Action!",
    "Barking News: Meet Our Furry Friends!",
    "Tail-Wagging Tales: Canine Chronicles",
    "Fetch the Fun: Dogs That Make Your Day!",
    "Woof-Worthy Moments: Dogs Stealing the Show!",
    "Pawprints and Smiles: The Dog Diaries",
    "Fur-ever Friends: Highlighting Doggo Adventures!",
    "Bark-a-lot: Latest Pups on Patrol!",
    "Sniffing Out Joy: Dogs on the Go!",
    "Canine Corner: Where Happiness Has a Tail!"
  ];

  useEffect(() => {
    fetch("https://dog.ceo/api/breeds/image/random")
      .then(res => res.json())
      .then(data => setDogImage(data.message))
      .catch(() => setDogImage(null));

    setDogHeading(dogHeadings[Math.floor(Math.random() * dogHeadings.length)]);
  }, []);

  return (
    <div className="post-card">
      <div className="post-header">
        <span role="img" aria-label="dog">🐶</span>
        <h3>{dogHeading}</h3>
      </div>
      <div className="post-body">
        {dogImage ? (
          <img src={dogImage} alt="Random Dog" style={{ width: "100%", borderRadius: "0.5rem" }} />
        ) : (
          <p>Fetching dog image...</p>
        )}
      </div>
    </div>
  );
}