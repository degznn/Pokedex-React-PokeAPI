import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from './App';
import { genderFromRate, sortByName } from './pokemonUtils';

jest.mock('axios');

beforeEach(() => {
  axios.get.mockImplementation((url) => {
    if (url.includes('/pokemon?')) return Promise.resolve({ data: { results: [] } });
    if (url.endsWith('/type')) return Promise.resolve({ data: { results: [] } });
    return Promise.resolve({ data: {} });
  });
});

test('muestra la interfaz principal y los filtros', async () => {
  render(<App />);
  expect(screen.getByText('Explora el mundo Pokémon')).toBeInTheDocument();
  expect(screen.getByLabelText('Buscar por nombre')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Limpiar filtros' })).toBeInTheDocument();
  await waitFor(() => expect(axios.get).toHaveBeenCalled());
});

test('ordena los nombres alfabéticamente', () => {
  const sorted = sortByName([{ name: 'zubat' }, { name: 'abra' }, { name: 'pikachu' }]);
  expect(sorted.map((item) => item.name)).toEqual(['abra', 'pikachu', 'zubat']);
});

test('interpreta correctamente la proporción de género', () => {
  expect(genderFromRate(-1)).toBe('genderless');
  expect(genderFromRate(0)).toBe('male');
  expect(genderFromRate(8)).toBe('female');
  expect(genderFromRate(4)).toBe('both');
});
