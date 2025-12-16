import React, { useState } from 'react';

const Actor = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [movie, setMovie] = useState("");

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Mój ulubiony Aktor/Aktorka (TSX)</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px" }}>
        
        <input 
          type="text" 
          placeholder="Podaj imię" 
          value={firstName}
          onChange={handleFirstNameChange} 
        />

        <input 
          type="text" 
          placeholder="Podaj nazwisko" 
          value={lastName}
          onChange={(e) => setLastName(e.target.value)} 
        />

        <input 
          type="text" 
          placeholder="Tytuł ulubionego filmu" 
          value={movie}
          onChange={(e) => setMovie(e.target.value)} 
        />
      </div>

      <div style={{ marginTop: "20px", borderTop: "2px solid #ccc", paddingTop: "10px" }}>
        <h3>Karta Informacyjna:</h3>
        <p><strong>Imię:</strong> {firstName}</p>
        <p><strong>Nazwisko:</strong> {lastName}</p>
        <p><strong>Ulubiony film:</strong> {movie}</p>
      </div>

    </div>
  );
};

export default Actor;