import React from "react";
import { CommentInput } from "./CommentInput";

describe("<CommentInput />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<CommentInput />);
  });
});
