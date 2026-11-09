import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CharacterList() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get('https://swapi.dev/api/people/')
      .then((response) => {
        setCharacters(response.data.results);
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudieron cargar los personajes.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center">Cargando personajes...</p>;
  }

  if (error) {
    return <p className="text-danger text-center">{error}</p>;
  }

  return (
    <div className="container mt-4">
      <div className="row g-3">
        {characters.map((character) => (
          <div className="col-md-4" key={character.url}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{character.name}</h5>
                <p className="card-text mb-1">Altura: {character.height}</p>
                <p className="card-text mb-0">Género: {character.gender}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CharacterList;
