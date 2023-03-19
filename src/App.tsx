import { FormEvent, useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

export function AlbumPicker() {
  const [albums, setAlbums] = useState<string[]>([]);
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formElements = form.elements as typeof form.elements & {
      artist: HTMLInputElement;
      date: HTMLInputElement;
    };
    if (
      formElements.artist.value === "lars" &&
      formElements.date.value === "1966"
    ) {
      formElements.date.setCustomValidity("Lars was born in 1966");
      return;
    }
    const artist = encodeURIComponent(formElements.artist.value);
    const date = encodeURIComponent(formElements.date.value);
    const query = [`artist:${artist}`, date && `date:${date}`]
      .filter((s) => s)
      .join(" AND ");
    const url = `https://musicbrainz.org/ws/2/release?fmt=json&query=${query}`;
    const response = await fetch(url);
    const mbResult = (await response.json()) as {
      releases: { title: string; date: string }[];
    };
    const { releases } = mbResult;
    setAlbums(releases.map(({ title, date }) => `${title} (${date})`));
  }
  function onInput(e: FormEvent) {
    const input = e.target as HTMLInputElement;
    console.log(input.validity);
    if (input.validity.badInput) {
      input.setCustomValidity("Please enter a valid year");
    } else if (input.validity.rangeUnderflow) {
      input.setCustomValidity("Please enter a year after 1950");
    } else {
      input.setCustomValidity("");
    }
  }
  return (
    <form onSubmit={handleSubmit} name="search" aria-label="search">
      <label>
        Artist name:
        <input name="artist" autoFocus={true} />
      </label>
      <label>
        Release date:
        <input name="date" type="number" min="1950" onInput={onInput} />
      </label>
      <button type="submit">Search</button>
      <p>Albums:</p>
      <ol>
        {albums.map((album, index) => (
          <li key={index}>{album}</li>
        ))}
      </ol>
    </form>
  );
}

function App() {
  const [count, setCount] = useState(0);

  const [page, setPage] = useState("count");
  const [isNavigating, setIsNavigating] = useState(true);
  useEffect(() => {
    function onPopState() {
      const page = new URLSearchParams(window.location.search).get("page");
      setIsNavigating(true);
      setPage(page || "count");
    }
    addEventListener("popstate", onPopState);
    onPopState();
    return () => removeEventListener("popstate", onPopState);
  }, []);
  useEffect(() => {
    setTimeout(() => {
      setIsNavigating(false);
    }, 1);
  }, [isNavigating]);
  function onNavigate(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    history.pushState({}, "", e.currentTarget.href);
    dispatchEvent(new PopStateEvent("popstate"));
  }

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <a href="?page=count" onClick={onNavigate}>
        Count
      </a>{" "}
      |{" "}
      <a href="?page=album" onClick={onNavigate}>
        Album
      </a>
      {page === "count" && (
        <div className={`card ${isNavigating ? "navigating" : "navigated"}`}>
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
        </div>
      )}
      {page === "album" && (
        <div className={`card ${isNavigating ? "navigating" : "navigated"}`}>
          <AlbumPicker />
        </div>
      )}
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
