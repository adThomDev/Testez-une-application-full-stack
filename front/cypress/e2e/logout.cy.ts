describe("Logging in then logging out", () => { 
  beforeEach(() => {
    cy.login();
  });

  it("should log out successfully and redirect to home", () => {
    cy.get('.mat-toolbar > .ng-star-inserted > :nth-child(3)').click();

    cy.location('pathname').should('eq', '/');
    cy.get('.mat-toolbar > .ng-star-inserted').should('not.contain', 'Logout');
    cy.get('.mat-toolbar > .ng-star-inserted').should('contain', 'Login');
  });
});
