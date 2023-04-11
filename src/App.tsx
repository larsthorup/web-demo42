import { useEffect, useState } from "react";
import AlbumPicker from "./AlbumPicker";
import { AlbumProvider } from "./AlbumProvider";
import "./App.css";
import reactLogo from "./assets/react.svg";

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
    <AlbumProvider>
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
    </AlbumProvider>
  );
}

export default App;
