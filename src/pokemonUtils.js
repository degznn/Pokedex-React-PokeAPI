export const PAGE_SIZE = 18;

export const TYPE_LABELS = {
  normal: 'Normal', fire: 'Fuego', water: 'Agua', electric: 'Eléctrico',
  grass: 'Planta', ice: 'Hielo', fighting: 'Lucha', poison: 'Veneno',
  ground: 'Tierra', flying: 'Volador', psychic: 'Psíquico', bug: 'Bicho',
  rock: 'Roca', ghost: 'Fantasma', dragon: 'Dragón', dark: 'Siniestro',
  steel: 'Acero', fairy: 'Hada',
};

export function formatName(name = '') {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function genderFromRate(rate) {
  if (rate === -1) return 'genderless';
  if (rate === 0) return 'male';
  if (rate === 8) return 'female';
  return 'both';
}

export function matchesGender(pokemonGender, selectedGender) {
  if (!selectedGender) return true;
  if (selectedGender === 'male') return pokemonGender === 'male' || pokemonGender === 'both';
  if (selectedGender === 'female') return pokemonGender === 'female' || pokemonGender === 'both';
  return pokemonGender === 'genderless';
}

export function sortByName(items) {
  return [...items].sort((a, b) => a.name.localeCompare(b.name, 'es'));
}
