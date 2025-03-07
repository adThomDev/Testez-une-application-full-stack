describe("Routing tests", () => {
  beforeEach(() => {
    //GIVEN : an user on the home page
    cy.visit("/");
  });

  it("should load the home page", () => {
    cy.location("pathname").should("eq", "/");
  });

  it("should navigate to /login when clicking Login", () => {
    cy.get('.mat-toolbar').should("contain", "Login");
    cy.get('[routerlink="login"]').click();
    cy.url().should("include", "/login");
  });

  it("should navigate to /register when clicking Register", () => {
    cy.get('.mat-toolbar').should("contain", "Register");
    cy.get('[routerlink="register"]').click();
    cy.url().should("include", "/register");
  });

  context("After logging in", () => {
    //GIVEN : a logged in user
    beforeEach(() => {
      cy.login();
    });

    it("should navigate to /me when clicking Account", () => {
      cy.get(".mat-toolbar > .ng-star-inserted").should("contain", "Account");
      cy.get('[routerlink="me"]').click();
      cy.url().should("include", "/me");
    });

    it("should navigate to /create when clicking Create", () => {
      cy.contains("button", "Create").click();
      cy.url().should("include", "/create");
    });

    it("should navigate to the home page when clicking Logout", () => {
      cy.get(".mat-toolbar > .ng-star-inserted").should("contain", "Logout");
      cy.get(".mat-toolbar > .ng-star-inserted > :nth-child(3)").click();
      cy.location("pathname").should("eq", "/");
    });
  });
});
