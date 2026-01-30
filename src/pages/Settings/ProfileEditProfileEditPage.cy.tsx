import React from "react";
import { ProfileEditPage } from "./ProfileEdit";

describe("<ProfileEditPage />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<ProfileEditPage />);
  });
});
