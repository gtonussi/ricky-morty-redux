import { useEffect, useState, type SyntheticEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import type { AppDispatch, RootState } from "./app/store";
import {
  fetchCharacters,
  toggleFavorite,
} from "./features/characters/charactersSlice";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error, query, favorites, info } = useSelector(
    (state: RootState) => state.characters,
  );
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchCharacters(""));
  }, [dispatch]);

  function handleSearch(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch(fetchCharacters(search));
  }

  function clearSearch() {
    setSearch("");
    dispatch(fetchCharacters(""));
  }

  const isLoading = status === "loading";

  return (
    <main className="app-shell">
      <header className="hero">
        <p className="eyebrow">React + Redux Toolkit</p>
        <h1>Rick &amp; Morty Explorer</h1>
        <p className="intro">
          Uma lista simples consumindo a API pública com{" "}
          <code>createAsyncThunk</code>.
        </p>
      </header>

      <section className="toolbar" aria-label="Buscar personagens">
        <form onSubmit={handleSearch}>
          <label htmlFor="character-search">Buscar por nome</label>
          <div className="search-row">
            <input
              id="character-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Ex.: Rick, Morty, Summer..."
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Buscando..." : "Buscar"}
            </button>
          </div>
        </form>

        <div className="results-summary" aria-live="polite">
          <strong>{info?.count ?? 0}</strong>
          <span>
            {query ? ` resultado(s) para “${query}”` : " personagens"}
          </span>
          <small>★ {favorites.length} favorito(s)</small>
        </div>
      </section>

      {status === "failed" && (
        <section className="message error" role="alert">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => dispatch(fetchCharacters(query))}
          >
            Tentar novamente
          </button>
        </section>
      )}

      {isLoading && items.length === 0 && (
        <p className="message" role="status">
          Carregando personagens...
        </p>
      )}

      {status === "succeeded" && items.length === 0 && (
        <section className="message">
          <p>Nenhum personagem encontrado.</p>
          <button type="button" onClick={clearSearch}>
            Limpar busca
          </button>
        </section>
      )}

      <section className="character-grid" aria-label="Personagens encontrados">
        {items.map((character) => {
          const isFavorite = favorites.includes(character.id);

          return (
            <article className="character-card" key={character.id}>
              <img src={character.image} alt={character.name} />
              <div className="character-content">
                <div className="card-heading">
                  <h2>{character.name}</h2>
                  <button
                    className={isFavorite ? "favorite active" : "favorite"}
                    type="button"
                    onClick={() => dispatch(toggleFavorite(character.id))}
                    aria-pressed={isFavorite}
                    aria-label={`Adicionar ${character.name} aos favoritos`}
                  >
                    ★
                  </button>
                </div>
                <p className="status-line">
                  <span
                    className={`status-dot ${character.status.toLowerCase()}`}
                  />
                  {character.status} — {character.species}
                </p>
                <dl>
                  <div>
                    <dt>Última localização</dt>
                    <dd>{character.location.name}</dd>
                  </div>
                  <div>
                    <dt>Origem</dt>
                    <dd>{character.origin.name}</dd>
                  </div>
                </dl>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}

export default App;

