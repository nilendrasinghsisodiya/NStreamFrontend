import { setupServer, SetupServerApi } from "msw/node";

let server: SetupServerApi | null = null;

export function getServer() {
  if (server) return server;
  server = setupServer();
  return server;
}
