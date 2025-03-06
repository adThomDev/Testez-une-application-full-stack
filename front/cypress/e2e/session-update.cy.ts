describe("Edit a session (mocked API)", () => {
  beforeEach(() => {
    cy.login();
  });

  it("should edit a session successfully", () => {
    //GIVEN : a session and its teacher
    cy.intercept("GET", "**/api/session/1", {
      statusCode: 200,
      body: {
        id: 1,
        name: "mockedSession",
        date: "2025-03-01",
        teacher_id: 1,
        description: "description",
        users: ["truc", "machin", "chose"],
        createdAt: "2025-02-01",
        updatedAt: "2025-02-01",
      },
    }).as("getSession");

    cy.intercept("GET", "**/api/teacher", {
      statusCode: 200,
      body: [
        { id: 1, firstName: "bobby", lastName: "bob" },
        { id: 2, firstName: "truc", lastName: "machin" },
      ],
    }).as("getTeachers");

    cy.intercept("PUT", "**/api/session/1", {
      statusCode: 200,
    }).as("updateSession");

    //WHEN : going on the sessions page and clicking on an edit button, getting on the edit form, inputing new data and submitting it
    cy.contains("button", "Edit").click();
    cy.wait("@getSession").its("response.statusCode").should("eq", 200);
    cy.get('input[formControlName="name"]').clear().type("Updated Session");
    cy.get('textarea[formControlName="description"]').clear().type("Updated session description");
    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.get('.mat-option').should('be.visible');
    cy.contains('.mat-option', 'bobby bob').click();
    cy.contains("button", "Save").click();

    //THEN : get back to the sessions page and get the success message
    cy.wait("@updateSession").its("response.statusCode").should("eq", 200);
    cy.url().should("include", "/sessions");
    cy.contains("Session updated !").should("exist");
  });
});
