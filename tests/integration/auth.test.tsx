import React from "react";
import { http, HttpResponse } from "msw";
import { getServer } from "./setup/server.setup";
import { fireEvent, screen, render } from "./setup/renderer.setup";
import "@testing-library/jest-dom";
import { LogInForm } from "../../src/forms/LoginForm";
import { describe, test, expect } from "vitest";
describe("login Form", () => {
  test("login form", () => {
    render(
      <LogInForm
        isPending={false}
        onSave={(formData) => {
          console.log(formData);
        }}
      />,
    );
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("Log In");
  });
});
