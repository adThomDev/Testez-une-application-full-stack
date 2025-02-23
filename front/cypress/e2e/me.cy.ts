describe("Account Page Navigation", () => {
  beforeEach(() => {
    cy.login();
  });

  it("should navigate to the account page and display user info", () => {
    //GIVEN : these user info
    const createdAt = new Date("2025-01-01");
    const updatedAt = new Date("2025-02-01");

    function formatDate(date: Date): string {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    cy.intercept("GET", "/api/user/1", {
      body: {
        id: 1,
        username: "userName",
        firstName: "firstName",
        lastName: "lastName",
        email: "user@aze.com",
        admin: true,
        createdAt: createdAt,
        updatedAt: updatedAt,
      },
    }).as("getUserInfo");

    //WHEN : visiting the user info page
    cy.get('span[routerlink="me"]').click();
    cy.url().should("include", "/me");
    cy.wait("@getUserInfo");

    //THEN : it should display these user info
    cy.get("h1").contains("User information").should("be.visible");
    cy.get(".mat-card-content > div.ng-star-inserted > :nth-child(1)")
      .contains("Name: firstName LASTNAME")
      .should("be.visible");
    cy.get(".mat-card-content > div.ng-star-inserted > :nth-child(2)")
      .contains("Email: user@aze.com")
      .should("be.visible");
    cy.get(".my2").contains("You are admin").should("be.visible");
    cy.get(".p2 > :nth-child(1)")
      .contains("Create at: " + formatDate(createdAt))
      .should("be.visible");
    cy.get(".p2 > :nth-child(2)")
      .contains("Last update: " + formatDate(updatedAt))
      .should("be.visible");
  });

  it("should navigate to the account page and there should be a delete account button if the user isn't an admin", () => {
    //GIVEN : a user who isn't an admin
    cy.intercept("GET", "/api/user/1", {
      body: {
        id: 1,
        username: "userName",
        firstName: "firstName",
        lastName: "lastName",
        email: "user@aze.com",
        admin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }).as("getUserInfo");

    //WHEN : visiting the user info page
    cy.get('span[routerlink="me"]').click();
    cy.url().should("include", "/me");
    cy.wait("@getUserInfo");

    //THEN : it should display a delete invitation and have a delete button weirdly named "Detail"
    cy.get(".my2").contains("Delete my account").should("be.visible");
    cy.get(".my2 > .mat-focus-indicator")
      .should("be.visible")
      .and("contain.text", "Detail")
      .and("have.prop", "tagName")
      .should("equal", "BUTTON");
  });
});
