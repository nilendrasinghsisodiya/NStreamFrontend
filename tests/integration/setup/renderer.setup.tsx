import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { render, RenderOptions } from "@testing-library/react";
import { getTestStore } from "./redux.setup";
import React from "react";
import { MemoryRouter } from "react-router-dom";
const AllProviders = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const store = getTestStore();

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        {" "}
        <MemoryRouter>{children}</MemoryRouter>{" "}
      </Provider>
    </QueryClientProvider>
  );
};

const renderWithProviders = (ui: React.ReactNode, options = {}) =>
  render(ui, { wrapper: AllProviders, ...options });
export * from "@testing-library/react";

export { renderWithProviders as render };
