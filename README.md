# Pokédex React + PokeAPI

Aplicación académica desarrollada con ReactJS que consume la API pública [PokeAPI](https://pokeapi.co/) mediante Axios. Permite explorar Pokémon, realizar búsquedas en tiempo real, combinar filtros y cargar resultados de forma incremental.

## Tecnologías

- React 19 y Create React App
- Axios para peticiones AJAX
- CSS personalizado y diseño responsive
- PokeAPI REST v2
- React Testing Library y Jest

## Funcionalidades

- Catálogo amplio de Pokémon ordenado alfabéticamente.
- Búsqueda por nombre con debounce de 350 ms.
- Filtros combinables por tipo, género, peso y altura.
- Información real de especie para interpretar la proporción de género.
- Tarjetas con imagen oficial, número, nombre, tipos, peso y altura.
- Botón **Cargar más** con lotes de 18 resultados.
- Estados de carga, lista vacía y error de conexión.
- Caché en memoria para evitar peticiones duplicadas.
- Diseño adaptable a computadora, tablet y celular.

## Estructura principal

```text
src/
├── App.js
├── App.css
├── PokemonExplorer.js
├── PokemonFilters.js
├── PokemonCard.js
├── pokemonUtils.js
└── App.test.js
```

## Instalación

```bash
npm install
```

## Ejecución

```bash
npm start
```

La aplicación se abre normalmente en `http://localhost:3000`. Si ese puerto está ocupado, React solicitará utilizar otro, por ejemplo `http://localhost:3001`.

## Pruebas

```bash
npm test -- --watchAll=false --runInBand
npm run build
```

## API utilizada

- Catálogo: `https://pokeapi.co/api/v2/pokemon`
- Detalle: `https://pokeapi.co/api/v2/pokemon/{id o nombre}`
- Especie y género: `https://pokeapi.co/api/v2/pokemon-species/{id o nombre}`
- Tipos: `https://pokeapi.co/api/v2/type`

PokeAPI expresa el peso en hectogramos y la altura en decímetros. La aplicación convierte estos valores a kilogramos y metros.

## Evidencias

La carpeta `evidencias` contiene diez subcarpetas preparadas para guardar capturas reales del código y de la aplicación ejecutada. Consulta `GUIA_EVIDENCIAS.md` para conocer qué debe mostrarse en cada captura.
