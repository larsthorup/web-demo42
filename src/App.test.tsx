import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import App from "./App";
import mockResponse from "./mock-response.json";

describe(App.name, () => {
  it("should show search results", async () => {
    const user = userEvent.setup();
    const mockFetch = vi
      .spyOn(window, "fetch")
      .mockImplementation(async (url: RequestInfo | URL) => {
        if (
          url ===
          "https://musicbrainz.org/ws/2/release?fmt=json&query=artist:rihanna"
        ) {
          return {
            json: async () => mockResponse,
          } as Response;
        } else {
          return {} as Response;
        }
      });

    render(<App />);

    const artistInput = screen.getByLabelText("Artist name:");
    await user.type(artistInput, "rihanna");
    const form = screen.getByRole("form", { name: "search" });
    fireEvent.submit(form);

    await screen.findByText("A Girl Like Me");

    expect(mockFetch).toHaveBeenCalledWith(
      "https://musicbrainz.org/ws/2/release?fmt=json&query=artist:rihanna"
    );
  });
});
