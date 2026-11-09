import React from 'react';
import { formatName, TYPE_LABELS } from './pokemonUtils';

const FALLBACK_IMAGE =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500"><rect width="100%" height="100%" rx="40" fill="#eef3ff"/><circle cx="250" cy="250" r="120" fill="#fff" stroke="#dce5f5" stroke-width="18"/><path d="M130 250h240" stroke="#dce5f5" stroke-width="18"/><circle cx="250" cy="250" r="35" fill="#ffcb05" stroke="#3b4cca" stroke-width="15"/></svg>');

const GENDER_LABELS = {
  male: 'Solo macho', female: 'Solo hembra', both: 'Macho y hembra', genderless: 'Sin género',
};

function PokemonCard({ pokemon }) {
  return (
    <article className="pokemon-card">
      <div className="pokemon-image-wrap">
        <span className="pokemon-number">#{String(pokemon.id).padStart(4, '0')}</span>
        <img
          src={pokemon.image || FALLBACK_IMAGE}
          alt={formatName(pokemon.name)}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = FALLBACK_IMAGE;
          }}
        />
      </div>

      <div className="pokemon-card-body">
        <h2>{formatName(pokemon.name)}</h2>
        <div className="type-list">
          {pokemon.types.map((type) => (
            <span className={`type-pill type-${type}`} key={type}>
              {TYPE_LABELS[type] || formatName(type)}
            </span>
          ))}
        </div>

        <dl className="pokemon-measures">
          <div><dt>Peso</dt><dd>{pokemon.weightKg.toFixed(1)} kg</dd></div>
          <div><dt>Altura</dt><dd>{pokemon.heightM.toFixed(1)} m</dd></div>
        </dl>
        <p className="gender-label">{GENDER_LABELS[pokemon.gender]}</p>
      </div>
    </article>
  );
}

export default PokemonCard;
