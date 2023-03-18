import { debug } from "vitest-preview";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import App, { AlbumPicker } from "./App";
import mockResponse from "./mock-response.json";

describe(App.name, () => {
  it("should render", () => {
    render(<App />);
    expect(screen.getByText("Album")).toBeInTheDocument();
  });
});

describe(AlbumPicker.name, () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should show search results", async () => {
    const user = userEvent.setup();
    const rihannaUrl =
      "https://musicbrainz.org/ws/2/release?fmt=json&query=artist:rihanna";
    const mockFetch = vi
      .spyOn(window, "fetch")
      .mockImplementation(async (url: RequestInfo | URL) => {
        if (url === rihannaUrl) {
          return {
            json: async () => mockResponse,
          } as Response;
        } else {
          return {} as Response;
        }
      });

    render(<App />);

    // Navigate to album search
    await user.click(screen.getByText("Album"));

    const artistInput = screen.getByLabelText("Artist name:");
    await user.type(artistInput, "rihanna");
    expect(artistInput).toHaveValue("rihanna");
    const form = screen.getByRole("form", { name: "search" });
    fireEvent.submit(form);

    await screen.findByText("A Girl Like Me (2006)");
    debug();
    expect(mockFetch).toHaveBeenCalledWith(rihannaUrl);
  });
});
