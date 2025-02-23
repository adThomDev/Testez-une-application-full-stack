describe('Login spec', () => {
  it('Login successfull', () => {
    //GIVEN : a user who wants to login
    cy.visit('/login')

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true
      },
    })

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []).as('session')

    //WHEN : logging in on the login page
    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    //THEN : it should redirect to the sessions page
    cy.url().should('include', '/sessions')
  })
});