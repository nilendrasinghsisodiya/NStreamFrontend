import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router";
import "./index.css";
import { QueryClientProvider as QueryProvider } from "@tanstack/react-query";
import { AppRoutes } from "./AppRoutes";
import { Provider } from "react-redux";
import { presister, store } from "./ContextStore";
import { queryClient } from "./api/ApiClient";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistGate } from "redux-persist/integration/react";
import ErrorBoundary from "./components/ErrorBoundary";
import {Toaster} from "sonner"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={presister} loading={null}>
        <QueryProvider client={queryClient}>
          <Toaster position="bottom-center" richColors closeButton theme="system" duration={6000} id="gloabal" />
          <Toaster offset={{left:"50vw",top:"50vh"}}  duration={Infinity} id="confirmation-center" />
            <ReactQueryDevtools client={queryClient} />
          <ErrorBoundary>
            <Router>
              <AppRoutes />
            </Router>
          </ErrorBoundary>
        </QueryProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
