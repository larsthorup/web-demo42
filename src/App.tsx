import { FormEvent, useState } from "react";
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
      <div className="card">
        <AlbumPicker />
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
