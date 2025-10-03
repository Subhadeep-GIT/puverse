// src/components/DogCard.jsx
import React from "react";

export default function DogCard({ dogImage, dogHeading }) {
  return (
    <div className="post-card dog-card">
      <div className="post-header">
        <span role="img" aria-label="dog">🐶</span>
        <h3>{dogHeading}</h3>
      </div>
      <div className="post-body dog-carousel">
        {dogImage ? (
          <img src={dogImage} alt="Random Dog" className="post-image dog-image" />
        ) : <p>Loading cute doggo...</p>}
      </div>
    </div>
  );
}