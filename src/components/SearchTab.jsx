// src/components/SearchTab.jsx
import React, { useState } from "react";
import axios from "axios";
import "../styles/searchtab.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

export default function SearchTab() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length === 0) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${BASE_URL}/search`, {
        params: { q: value },
        withCredentials: true,
      });

      setResults(res.data || []);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to fetch results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-tab p-4">
      {/* Search Input */}
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search by username, post title or caption..."
        className="search-input w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-400"
      />

      {/* Loading */}
      {loading && <p className="mt-3 text-gray-500 text-sm">Searching...</p>}

      {/* Error */}
      {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}

      {/* Results */}
      {!loading && results.length > 0 && (
        <ul className="mt-4 space-y-2">
          {results.map((item) => (
            <li
              key={item.id}
              className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer"
            >
              {item.type === "user" ? (
                <div>
                  <strong>@{item.username}</strong>
                  <p className="text-sm text-gray-600">User</p>
                </div>
              ) : (
                <div>
                  <p className="font-semibold">{item.title}</p>
                  {item.caption && <p className="text-sm text-gray-700">{item.caption}</p>}
                  <p className="text-sm text-gray-500">Post</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* No results */}
      {!loading && query.length > 0 && results.length === 0 && (
        <p className="mt-3 text-gray-500 text-sm">No results found.</p>
      )}
    </div>
  );
}