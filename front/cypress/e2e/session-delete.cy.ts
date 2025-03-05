describe("Delete a session (mocked API)", () => {
  beforeEach(() => {
    cy.login();
  });

  it("should delete a session successfully", () => {
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

    cy.intercept("GET", "**/api/teacher/1", {
      statusCode: 200,
      body: {
        id: 1,
        lastName: "thebob",
        firstName: "bobby",
        createdAt: "2025-02-01",
        updatedAt: "2025-02-01",
      },
    }).as("getTeacher");

    cy.intercept("DELETE", "**/api/session/1", {
      statusCode: 200,
    }).as("deleteSession");

    //WHEN : going on a detail page of a session and click the delete button
    cy.contains("span.ml1", "Detail").click();
    cy.wait("@getSession").its("response.statusCode").should("eq", 200);
    cy.wait("@getTeacher").its("response.statusCode").should("eq", 200);
    cy.contains("button", "Delete").click();

    //THEN : the session is deleted
    cy.wait("@deleteSession").its("response.statusCode").should("eq", 200);
    cy.url().should("include", "/sessions");
    cy.get("body").should("not.contain", "mockedSession");
  });
});
