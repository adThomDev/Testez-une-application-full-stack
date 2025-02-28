

describe("Session Creation Form", () => {
  beforeEach(() => {
    // GIVEN : an user logged in, a teacher list to GET and a session to POST
    cy.login();
    cy.intercept("GET", "/api/teacher", {
      body: [
        { id: 1, firstName: "bobby", lastName: "bob" },
        { id: 2, firstName: "machin", lastName: "truc" },
      ],
    }).as("getTeachers");
    cy.intercept("POST", "/api/session", {
      statusCode: 201,
      body: {
        id: 1,
        name: "newSession",
        date: "2025-03-01",
        teacher_id: 1,
        description: "session description",
        users: [],
        createdAt: "2025-02-01",
        updatedAt: "2025-02-01",
      },
    }).as("createSession");
  });

  it("should create a new session successfully", () => {
    // WHEN : going on the session creation page and filling the form
    cy.contains("button", "Create").click();
    cy.wait("@getTeachers");
    cy.get("h1").should("contain.text", "Create session");
    cy.get('input[formControlName="name"]').type("newSession");
    cy.get('input[formControlName="date"]').type("2025-03-01");
    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.contains("mat-option", "bobby bob").click();
    cy.get('textarea[formControlName="description"]').type("session description");
    cy.get('button[type="submit"]').click();

    // THEN : check that the session has been created and we're redirected to the session list page
    cy.wait("@createSession").then((interception: SessionInterception) => {
      expect(interception.response.statusCode).to.eq(201);
    });
    cy.contains("Session created !").should("be.visible");
    cy.url().should("include", "/sessions");
  });
});
interface SessionInterception {
  response: {
    statusCode: number;
  };
}