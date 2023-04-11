import { FormEvent } from "react";
import { useAlbum, useAlbumDispatch } from "./AlbumProvider";

async function logResults(url: string, message: string) {
  // Note: view log at https://requestbin.com/r/enafxgfzxrpok
  const requestBinUrl = "https://enafxgfzxrpok.x.pipedream.net";
  const response = await fetch(requestBinUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, message }),
  });
  if (!response.ok) {
    console.error(`Failed to log results: ${response.status}`);
  }
}

export default function AlbumPicker() {
  const albumState = useAlbum();
  const albumDispatch = useAlbumDispatch();
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
    logResults(url, `Found ${releases.length} albums`);
    const albums = releases.map(({ title, date }) => `${title} (${date})`);
    albumDispatch({
      type: "search-result",
      payload: {
        artist,
        date,
        albums,
      },
    });
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
        <input
          name="artist"
          autoFocus={true}
          defaultValue={albumState.artist}
        />
      </label>
      <label>
        Release date:
        <input
          name="date"
          type="number"
          min="1950"
          onInput={onInput}
          defaultValue={albumState.date}
        />
      </label>
      <button type="submit">Search</button>
      <p>Albums:</p>
      <ol>
        {albumState.albums.map((album, index) => (
          <li key={index}>{album}</li>
        ))}
      </ol>
    </form>
  );
}
