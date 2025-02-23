describe("Sessions Page", () => {
  beforeEach(() => {
    //GIVEN : a logged in user and sessions fetched, WHEN arriving on the sessions page
    cy.login();
  });

  it("should display the correct sessions", () => {
    //THEN : it should display these sessions
    cy.contains("sessionName").should("be.visible");
    cy.contains("sessionName2").should("be.visible");

    cy.contains("sessionDescription").should("be.visible");
    cy.contains("sessionDescription2").should("be.visible");

    cy.contains("Session on January 1, 2020").should("be.visible");
    cy.contains("Session on February 2, 2020").should("be.visible");

    cy.get("button:contains('Detail')").should("have.length", 2);
    cy.get("button:contains('Edit')").should("have.length", 2);
  });
});

