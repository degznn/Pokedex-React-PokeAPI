import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import PokemonCard from './PokemonCard';
import PokemonFilters from './PokemonFilters';
import { genderFromRate, matchesGender, PAGE_SIZE, sortByName } from './pokemonUtils';

const API = 'https://pokeapi.co/api/v2';
const EMPTY_FILTERS = {
  search: '', type: '', gender: '', minWeight: '', maxWeight: '', minHeight: '', maxHeight: '',
};

function PokemonExplorer() {
  const [catalog, setCatalog] = useState([]);
  const [types, setTypes] = useState([]);
  const [typeNames, setTypeNames] = useState(null);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [pokemonDetails, setPokemonDetails] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingType, setLoadingType] = useState(false);
  const [error, setError] = useState('');
  const cache = useRef(new Map());

  useEffect(() => {
    let active = true;
    setLoadingCatalog(true);

    Promise.all([
      axios.get(`${API}/pokemon?limit=2000&offset=0`),
      axios.get(`${API}/type`),
    ])
      .then(([pokemonResponse, typeResponse]) => {
        if (!active) return;
        setCatalog(sortByName(pokemonResponse.data.results));
        setTypes(typeResponse.data.results.filter((type) => !['unknown', 'shadow'].includes(type.name)));
        setLoadingCatalog(false);
      })
      .catch(() => {
        if (!active) return;
        setError('No fue posible conectar con PokeAPI. Revisa tu conexión e intenta nuevamente.');
        setLoadingCatalog(false);
      });

    return () => { active = false; };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search.trim().toLowerCase());
    }, 350);
    return () => clearTimeout(timer);
  }, [filters.search]);

  useEffect(() => {
    let active = true;
    if (!filters.type) {
      setTypeNames(null);
      setLoadingType(false);
      return undefined;
    }

    setLoadingType(true);
    setTypeNames(null);
    axios.get(`${API}/type/${filters.type}`)
      .then((response) => {
        if (!active) return;
        setTypeNames(new Set(response.data.pokemon.map((entry) => entry.pokemon.name)));
        setLoadingType(false);
      })
      .catch(() => {
        if (!active) return;
        setError('No se pudo aplicar el filtro por tipo.');
        setLoadingType(false);
      });

    return () => { active = false; };
  }, [filters.type]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [debouncedSearch, filters.type, filters.gender, filters.minWeight, filters.maxWeight, filters.minHeight, filters.maxHeight]);

  const candidates = useMemo(() => {
    if (filters.type && !typeNames) return [];
    return catalog.filter((entry) => {
      const matchesName = !debouncedSearch || entry.name.toLowerCase().includes(debouncedSearch);
      const matchesType = !filters.type || typeNames.has(entry.name);
      return matchesName && matchesType;
    });
  }, [catalog, debouncedSearch, filters.type, typeNames]);

  const visibleEntries = useMemo(
    () => candidates.slice(0, visibleCount),
    [candidates, visibleCount],
  );

  useEffect(() => {
    let active = true;
    if (!visibleEntries.length) {
      setPokemonDetails([]);
      setLoadingDetails(false);
      return undefined;
    }

    const loadDetails = async () => {
      setLoadingDetails(true);
      setError('');

      const loadEntry = async (entry) => {
        if (cache.current.has(entry.name)) return cache.current.get(entry.name);

        const pokemonResponse = await axios.get(entry.url);
        const pokemon = pokemonResponse.data;
        let genderRate = -1;

        try {
          const speciesResponse = await axios.get(pokemon.species.url);
          genderRate = speciesResponse.data.gender_rate;
        } catch {
          genderRate = -1;
        }

        const normalized = {
          id: pokemon.id,
          name: pokemon.name,
          image: pokemon.sprites.other?.['official-artwork']?.front_default
            || pokemon.sprites.front_default,
          types: pokemon.types.map((item) => item.type.name),
          weightKg: pokemon.weight / 10,
          heightM: pokemon.height / 10,
          gender: genderFromRate(genderRate),
        };

        cache.current.set(entry.name, normalized);
        return normalized;
      };

      const settled = [];
      const concurrency = 4;
      for (let index = 0; index < visibleEntries.length; index += concurrency) {
        const batch = visibleEntries.slice(index, index + concurrency).map(loadEntry);
        const batchResults = await Promise.allSettled(batch);
        settled.push(...batchResults);
        if (!active) return;
      }

      if (!active) return;
      const loaded = settled.filter((item) => item.status === 'fulfilled').map((item) => item.value);
      setPokemonDetails(sortByName(loaded));
      setLoadingDetails(false);
      if (!loaded.length) setError('No se pudieron recuperar los detalles de los Pokémon.');
    };

    loadDetails();
    return () => { active = false; };
  }, [visibleEntries]);

  const filteredPokemon = useMemo(() => {
    const minWeight = filters.minWeight === '' ? null : Number(filters.minWeight);
    const maxWeight = filters.maxWeight === '' ? null : Number(filters.maxWeight);
    const minHeight = filters.minHeight === '' ? null : Number(filters.minHeight);
    const maxHeight = filters.maxHeight === '' ? null : Number(filters.maxHeight);

    return pokemonDetails.filter((pokemon) => (
      (minWeight === null || pokemon.weightKg >= minWeight)
      && (maxWeight === null || pokemon.weightKg <= maxWeight)
      && (minHeight === null || pokemon.heightM >= minHeight)
      && (maxHeight === null || pokemon.heightM <= maxHeight)
      && matchesGender(pokemon.gender, filters.gender)
    ));
  }, [pokemonDetails, filters.gender, filters.minHeight, filters.maxHeight, filters.minWeight, filters.maxWeight]);

  const updateFilter = (name, value) => setFilters((current) => ({ ...current, [name]: value }));
  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setDebouncedSearch('');
    setVisibleCount(PAGE_SIZE);
  };

  const isLoading = loadingCatalog || loadingType || loadingDetails;
  const hasMore = visibleCount < candidates.length;

  return (
    <main className="pokedex-page">
      <section className="pokedex-hero">
        <div className="hero-copy">
          <span className="hero-kicker">POKÉDEX REACT + AJAX</span>
          <h1>Explora el mundo Pokémon</h1>
          <p>Busca por nombre o combina filtros de tipo, peso, altura y género. Los resultados se ordenan automáticamente de la A a la Z.</p>
        </div>
        <div className="pokeball-art" aria-hidden="true"><span /></div>
      </section>

      <PokemonFilters
        filters={filters}
        types={types}
        onChange={updateFilter}
        onClear={clearFilters}
        searching={filters.search.trim().toLowerCase() !== debouncedSearch}
      />

      <section className="results-section">
        <div className="results-heading">
          <div>
            <span className="section-kicker">RESULTADOS</span>
            <h2>Pokémon encontrados</h2>
          </div>
          <strong>{filteredPokemon.length} visibles de {candidates.length}</strong>
        </div>

        {!filters.search && !filters.type && !filters.gender && !filters.minWeight && !filters.maxWeight && !filters.minHeight && !filters.maxHeight && (
          <div className="info-message">Escribe un nombre o combina los filtros para encontrar tu Pokémon.</div>
        )}

        {error && <div className="error-message">{error}</div>}

        {isLoading && (
          <div className="pokemon-loading"><span className="pokemon-spinner" /><p>Consultando PokeAPI...</p></div>
        )}

        {!isLoading && !error && filteredPokemon.length === 0 && (
          <div className="empty-results"><span>?</span><h3>No encontramos coincidencias</h3><p>Prueba con otro nombre, amplía los rangos o limpia los filtros.</p></div>
        )}

        <div className="pokemon-grid">
          {filteredPokemon.map((pokemon) => <PokemonCard pokemon={pokemon} key={pokemon.id} />)}
        </div>

        {hasMore && (
          <button className="load-more-button" type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)} disabled={loadingDetails}>
            {loadingDetails ? 'Cargando...' : `Cargar ${Math.min(PAGE_SIZE, candidates.length - visibleCount)} más`}
          </button>
        )}
      </section>
    </main>
  );
}

export default PokemonExplorer;
