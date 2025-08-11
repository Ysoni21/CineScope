import React, { useState } from "react";

const mockGenres = ["Action", "Comedy", "Drama", "Horror", "Animation", "Romance"];
const mockYears = ["2025", "2024", "2023", "2022", "2021"];
const mockLanguages = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "ja", label: "Japanese" },
  { code: "es", label: "Spanish" },
];
const mockTypes = ["movie", "tv"];

export default function FilterBar({ onFilterChange }) {
  const [open, setOpen] = useState({ genre: false, year: false, language: false, type: false });
  const [selected, setSelected] = useState({ genre: null, year: null, language: null, type: null });

  const toggle = (key) => setOpen((s) => ({ ...s, [key]: !s[key] }));

  const pick = (key, value) => {
    const next = { ...selected, [key]: value };
    setSelected(next);
    setOpen((s) => ({ ...s, [key]: false }));
    if (onFilterChange) onFilterChange(next);
  };

  const clearAll = () => {
    const empty = { genre: null, year: null, language: null, type: null };
    setSelected(empty);
    if (onFilterChange) onFilterChange(empty);
  };

  return (
    <div className="filter-bar">
      {/* Genre */}
      <div className="filter-dropdown">
        <button className="filter-btn" onClick={() => toggle("genre")}>
          {selected.genre || "Genre"} ▾
        </button>
        {open.genre && (
          <div className="filter-menu">
            {mockGenres.map((g) => (
              <button
                key={g}
                className={`filter-item ${selected.genre === g ? "active" : ""}`}
                onClick={() => pick("genre", g)}
              >
                {g}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Year */}
      <div className="filter-dropdown">
        <button className="filter-btn" onClick={() => toggle("year")}>
          {selected.year || "Year"} ▾
        </button>
        {open.year && (
          <div className="filter-menu">
            {mockYears.map((y) => (
              <button
                key={y}
                className={`filter-item ${selected.year === y ? "active" : ""}`}
                onClick={() => pick("year", y)}
              >
                {y}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Language */}
      <div className="filter-dropdown">
        <button className="filter-btn" onClick={() => toggle("language")}>
          {selected.language ? selected.language.label : "Language"} ▾
        </button>
        {open.language && (
          <div className="filter-menu">
            {mockLanguages.map((l) => (
              <button
                key={l.code}
                className={`filter-item ${selected.language?.code === l.code ? "active" : ""}`}
                onClick={() => pick("language", l)}
              >
                {l.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Type */}
      <div className="filter-dropdown">
        <button className="filter-btn" onClick={() => toggle("type")}>
          {selected.type || "Type"} ▾
        </button>
        {open.type && (
          <div className="filter-menu">
            {mockTypes.map((t) => (
              <button
                key={t}
                className={`filter-item ${selected.type === t ? "active" : ""}`}
                onClick={() => pick("type", t)}
              >
                {t === "movie" ? "Movie" : "TV Series"}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Clear All */}
      <button
        className="filter-clear"
        onClick={clearAll}
        disabled={!Object.values(selected).some((v) => v)}
      >
        Clear
      </button>
    </div>
  );
}
