import React, { useState } from 'react';

function DataLoader() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);

    // Simulamos una petición Ajax con un retraso de 2 segundos.
    setTimeout(() => {
      const newData = ['Elemento 1', 'Elemento 2', 'Elemento 3'];
      setData(newData);
      setLoading(false);
    }, 2000);
  };

  return (
    <main className="data-page">
      <section className="data-card">
        <span className="data-label">LABORATORIO AJAX</span>
        <h1>Mi Página con React y Ajax</h1>
        <p className="data-description">
          Simulación de una petición asíncrona con estados de carga.
        </p>

        <button className="load-button" onClick={fetchData} disabled={loading}>
        {loading ? 'Cargando...' : 'Cargar Datos'}
        </button>

        <div className="data-content" aria-live="polite">
        {loading ? (
            <div className="loading-state">
              <span className="spinner" />
              <p>Cargando datos...</p>
            </div>
        ) : data.length > 0 ? (
            <ul className="data-list">
            {data.map((item, index) => (
                <li key={index}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {item}
                </li>
            ))}
          </ul>
        ) : (
            <div className="empty-state">
              <span>↻</span>
              <p>No hay datos disponibles.</p>
              <small>Presiona el botón para comenzar la simulación.</small>
            </div>
        )}
        </div>
      </section>
    </main>
  );
}

export default DataLoader;
