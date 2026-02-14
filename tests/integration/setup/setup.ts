import { cleanup } from "@testing-library/react";
import { beforeAll, afterEach, afterAll } from "vitest";
import { getServer } from "./server.setup";
const server = getServer();
beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => server.close());
