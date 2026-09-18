# Rick & Morty Explorer

Aplicação React pequena, pensada para um exercício de live coding de aproximadamente 45 minutos. Ela consome a [Rick and Morty API](https://rickandmortyapi.com/), permite buscar personagens por nome e marcar favoritos localmente.

## Conceitos demonstrados

- `configureStore` e `Provider`;
- `createSlice` para a interação síncrona de favoritos;
- `createAsyncThunk` para buscar personagens;
- tratamento dos estados `pending`, `fulfilled` e `rejected` em `extraReducers`;
- `useDispatch`, `useSelector` e `useEffect`;
- prevenção de fetch duplicado no `StrictMode` com `condition` do thunk.

## Executar localmente

```bash
pnpm install
pnpm dev
```

Para validar o projeto:

```bash
pnpm run lint
pnpm run build
```

