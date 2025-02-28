describe("Session detail page navigation", () => {
  beforeEach(() => {
    //GIVEN : an user logged in, a session and its teacher
    cy.login();
    cy.intercept("GET", "/api/session/1", {
      body: {
        id: 1,
        name: "Session",
        date: "2020-01-01",
        teacher_id: 1,
        description: "sessionDescription",
        users: ["tartempion", "tartempion2"],
        createdAt: "2025-01-01",
        updatedAt: "2025-01-01",
      },
    }).as("getSessionDetail");

    cy.intercept("GET", "/api/teacher/1", {
      body: {
        id: 1,
        firstName: "Margot",
        lastName: "DELAHAYE",
        createdAt: "2025-01-24",
        updatedAt: "2025-01-24",
      },
    }).as("getTeacherDetail");
  });

  it("should navigate to the session detail page and display correct session information", () => {
    //WHEN : clicking on the first session card
    cy.get(":nth-child(1) > .mat-card-actions > :nth-child(1)").click();

    //THEN : it should redirect to the session detail page and display the correct session information
    cy.wait("@getSessionDetail")
      .its("response.body.users.length")
      .then((userCount) => {
        cy.get(
          ".mat-card-content > :nth-child(1) > :nth-child(1) > .ml1"
        ).should("contain.text", `${userCount} attendees`);
      });
    cy.wait("@getTeacherDetail");
    cy.get("mat-card-subtitle").should("contain.text", "Margot DELAHAYE");
    cy.get("h1").should("contain.text", "Session");
    cy.get(".description").should("contain.text", "sessionDescription");
    cy.get(":nth-child(2) > .ml1")
      .eq(0)
      .should("contain.text", "January 1, 2020");
    cy.get(".created").should("contain.text", "Create at:  January 1, 2025");
    cy.get(".updated").should("contain.text", "Last update:  January 1, 2025");
  });
});
