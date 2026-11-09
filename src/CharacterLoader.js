import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Alert, Spinner, Badge } from 'react-bootstrap';

const FALLBACK_IMAGE =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800"><rect width="100%" height="100%" fill="#171717"/><text x="50%" y="50%" fill="#F58220" font-family="Arial" font-size="42" text-anchor="middle">STAR WARS</text></svg>');

function CharacterLoader() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadCharacters = () => {
    setLoading(true);
    setError('');

    axios
      .get('https://akabab.github.io/starwars-api/api/all.json')
      .then((response) => {
        setCharacters(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudieron cargar los personajes.');
        setLoading(false);
      });
  };

  return (
    <Container className="py-5">
      <header className="hero-panel text-center mb-4">
        <span className="brand-kicker">GALACTIC DIRECTORY</span>
        <h1>Personajes de Star Wars</h1>
        <p>Consulta una colección ampliada de personajes mediante Axios.</p>
        <Button className="load-characters-button" onClick={loadCharacters} disabled={loading}>
          {loading ? 'Cargando personajes...' : 'Cargar todos los personajes'}
        </Button>
      </header>

      {loading && (
        <div className="loading-characters">
          <Spinner animation="border" role="status" />
          <span>Consultando la galaxia...</span>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {characters.length > 0 && (
        <p className="results-counter">{characters.length} personajes encontrados</p>
      )}

      <Row className="g-4">
        {characters.map((character) => (
          <Col key={character.id} xs={12} sm={6} md={4} lg={3}>
            <Card className="character-card h-100 border-0">
              <Card.Img
                variant="top"
                src={`https://starwarsgallery.netlify.app/assets/people/${character.id}.jpg`}
                alt={character.name}
                referrerPolicy="no-referrer"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
              <Card.Body>
                <Badge className="character-badge">{character.species || 'Desconocido'}</Badge>
                <Card.Title>{character.name}</Card.Title>
                <Card.Text>
                  <strong>Género:</strong> {character.gender || 'Desconocido'}
                  <br />
                  <strong>Altura:</strong> {character.height ? `${character.height} m` : 'Desconocida'}
                  <br />
                  <strong>Planeta:</strong> {character.homeworld || 'Desconocido'}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default CharacterLoader;
