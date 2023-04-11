import { createContext, useContext, useReducer } from "react";

type AlbumState = {
  artist: string;
  date: string;
  albums: string[];
};
const initialAlbumState: AlbumState = {
  artist: "",
  date: "",
  albums: [],
};
export type AlbumAction = { type: "search-result"; payload: AlbumState };

export function albumReducer(state: AlbumState, action: AlbumAction) {
  switch (action.type) {
    case "search-result":
      return action.payload;
  }
}

export const AlbumContext = createContext<AlbumState | null>(null);
export const AlbumDispatchContext =
  createContext<React.Dispatch<AlbumAction> | null>(null);

export function AlbumProvider({ children }: React.PropsWithChildren<{}>) {
  const [albumState, albumDispatch] = useReducer(
    albumReducer,
    initialAlbumState
  );
  return (
    <AlbumContext.Provider value={albumState}>
      <AlbumDispatchContext.Provider value={albumDispatch}>
        {children}
      </AlbumDispatchContext.Provider>
    </AlbumContext.Provider>
  );
}

export function useAlbum() {
  const album = useContext(AlbumContext);
  if (album === null) {
    throw new Error("Unexpected useAlbum without parent <AlbumProvider>");
  }
  return album;
}

export function useAlbumDispatch() {
  const dispatch = useContext(AlbumDispatchContext);
  if (dispatch === null) {
    throw new Error(
      "Unexpected useAlbumDispatch without parent <AlbumProvider>"
    );
  }
  return dispatch;
}
