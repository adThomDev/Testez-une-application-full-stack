describe("Not Found Page", () => {
  beforeEach(() => {
    // GIVEN: a logged-in user
    cy.login();
  });

  it("should display the Not Found page when visiting an invalid URL", () => {
    // WHEN: navigating to a non-existent page
    cy.visit("/random-page", { failOnStatusCode: false });

    // THEN: the Not Found page should be displayed
    cy.get("h1").should("contain.text", "Page not found !");
  });
});
