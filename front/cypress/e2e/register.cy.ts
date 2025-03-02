describe("User Registration", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get('[routerlink="register"]').click();
  });

  it('should register a user successfully', () => {
    //GIVEN : a user with correct credentials
    cy.intercept('POST', '/api/auth/register', {
      body: {
        firstName: 'bobby',
        lastName: 'bob',
        email: 'aze@aze.com',
        password: 'password',
      },
    });

    //WHEN : registering with correct credentials
    cy.visit('/register');
    cy.get('input[formControlName="firstName"]').type("bobby");
    cy.get('input[formControlName="lastName"]').type("bob");
    cy.get('input[formControlName="email"]').type("aze@aze.com");
    cy.get('input[formControlName="password"]').type("password");
    cy.get("button").contains("Submit").click();

    //THEN : should redirect to the login page
    cy.url().should('include', '/login');
  });

  it("should show error message when form validation fails", () => {
    //WHEN : registering with incorrect credentials
    cy.get('input[formControlName="firstName"]').type("bobby");
    cy.get('input[formControlName="lastName"]').type("bob");
    cy.get('input[formControlName="email"]').type("aze@aze.com");
    cy.get('input[formControlName="password"]').type("aze");
    cy.get("button").contains("Submit").click();

    //THEN : should display an error message and stay on the register page
    cy.get(".error").should("contain.text", "An error occurred");
    cy.url().should("include", "/register");
  });
});
