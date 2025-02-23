describe("Logging in then logging out", () => { 
  beforeEach(() => {
    //GIVEN : a logged in user
    cy.login();
  });

  it("should log out successfully and redirect to home", () => {
    //WHEN : logging out
    cy.get('.mat-toolbar > .ng-star-inserted > :nth-child(3)').click();

    //THEN : it should log out and redirect to home
    cy.location('pathname').should('eq', '/');
    cy.get('.mat-toolbar > .ng-star-inserted').should('not.contain', 'Logout');
    cy.get('.mat-toolbar > .ng-star-inserted').should('contain', 'Login');
  });
});
