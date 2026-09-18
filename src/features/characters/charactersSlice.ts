import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

type Character = {
  id: number;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  species: string;
  image: string;
  origin: { name: string };
  location: { name: string };
};

type ApiResponse = {
  info: { count: number; pages: number };
  results: Character[];
};

type CharactersState = {
  items: Character[];
  favorites: number[];
  query: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  info: ApiResponse["info"] | null;
};

const initialState: CharactersState = {
  items: [],
  favorites: [],
  query: "",
  status: "idle",
  error: null,
  info: null,
};

export const fetchCharacters = createAsyncThunk<
  ApiResponse,
  string,
  { state: RootState; rejectValue: string }
>(
  "characters/fetchCharacters",
  async (query, { rejectWithValue }) => {
    try {
      const url = new URL("https://rickandmortyapi.com/api/character");
      if (query.trim()) url.searchParams.set("name", query.trim());

      const response = await fetch(url);
      if (!response.ok) {
        return rejectWithValue(
          response.status === 404
            ? "Nenhum personagem encontrado para essa busca."
            : "Não foi possível carregar os personagens.",
        );
      }

      return (await response.json()) as ApiResponse;
    } catch {
      return rejectWithValue("Erro de rede. Tente novamente em instantes.");
    }
  },
  {
    // Evita a segunda chamada do StrictMode enquanto a mesma busca está pendente.
    condition: (query, { getState }) => {
      const characters = getState().characters;
      return !(characters.status === "loading" && characters.query === query);
    },
  },
);

const charactersSlice = createSlice({
  name: "characters",
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      state.favorites = state.favorites.includes(id)
        ? state.favorites.filter((favoriteId) => favoriteId !== id)
        : [...state.favorites, id];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCharacters.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
        state.query = action.meta.arg.trim();
        state.items = [];
        state.info = null;
      })
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.results;
        state.info = action.payload.info;
      })
      .addCase(fetchCharacters.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ??
          action.error.message ??
          "Ocorreu um erro inesperado.";
      });
  },
});

export const { toggleFavorite } = charactersSlice.actions;
export default charactersSlice.reducer;

