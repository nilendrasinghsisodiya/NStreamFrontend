import React from "react";
import { Deletion } from "./Deletion";

describe("<Deletion />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Deletion />);
  });
});
