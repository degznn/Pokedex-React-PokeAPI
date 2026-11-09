import React from 'react';
import { formatName, TYPE_LABELS } from './pokemonUtils';

function PokemonFilters({ filters, types, onChange, onClear, searching }) {
  const change = (event) => onChange(event.target.name, event.target.value);

  return (
    <section className="filters-panel" aria-label="Filtros de Pokémon">
      <div className="search-field">
        <label htmlFor="pokemon-search">Buscar por nombre</label>
        <div className="search-input-wrap">
          <span aria-hidden="true">⌕</span>
          <input
            id="pokemon-search"
            name="search"
            value={filters.search}
            onChange={change}
            placeholder="Ej. pikachu, charizard..."
            autoComplete="off"
          />
          {searching && <small>Buscando...</small>}
        </div>
      </div>

      <div className="filter-grid">
        <label>
          Tipo
          <select name="type" value={filters.type} onChange={change}>
            <option value="">Todos los tipos</option>
            {types.map((type) => (
              <option value={type.name} key={type.name}>
                {TYPE_LABELS[type.name] || formatName(type.name)}
              </option>
            ))}
          </select>
        </label>

        <label>
          Género
          <select name="gender" value={filters.gender} onChange={change}>
            <option value="">Todos</option>
            <option value="male">Macho disponible</option>
            <option value="female">Hembra disponible</option>
            <option value="genderless">Sin género</option>
          </select>
        </label>

        <label>Peso mínimo (kg)<input type="number" min="0" step="0.1" name="minWeight" value={filters.minWeight} onChange={change} placeholder="0" /></label>
        <label>Peso máximo (kg)<input type="number" min="0" step="0.1" name="maxWeight" value={filters.maxWeight} onChange={change} placeholder="Sin límite" /></label>
        <label>Altura mínima (m)<input type="number" min="0" step="0.1" name="minHeight" value={filters.minHeight} onChange={change} placeholder="0" /></label>
        <label>Altura máxima (m)<input type="number" min="0" step="0.1" name="maxHeight" value={filters.maxHeight} onChange={change} placeholder="Sin límite" /></label>
      </div>

      <button className="clear-button" type="button" onClick={onClear}>Limpiar filtros</button>
    </section>
  );
}

export default PokemonFilters;
