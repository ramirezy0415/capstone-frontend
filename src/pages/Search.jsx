import { useState, useEffect } from "react";

export default function Search({
  placeholder,
  query,
  setQuery,
  results,
  onSelect,
}) {
  return (
    <div className="search-container">

      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {query && (
        <div className="search-results">
          {results.length === 0 && (
            <p>No results found for "{query}"</p>
          )}

          {results.map((item) => (
            <div
              key={item.id}
              className="search-item"
              onClick={() => onSelect(item)}
            >
              {item.username || item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
