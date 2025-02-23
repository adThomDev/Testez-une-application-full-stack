declare namespace Cypress {
  interface Chainable {
    login(): Chainable<void>;
  }
}

Cypress.Commands.add("login", () => {
  //GIVEN : an user and some sessions
  cy.intercept("POST", "/api/auth/login", {
    body: {
      token: "jwtToken",
      type: "Bearer",
      id: 1,
      username: "yoga@studio.com",
      firstName: "Admin",
      lastName: "Admin",
      admin: true,
    },
  }).as("loggingIn");

  cy.intercept(
    {
      method: "GET",
      url: "/api/session",
    },
    [
      {
        id: 1,
        name: "sessionname",
        date: "2020-01-01",
        teacher_id: 1,
        description: "sessionDescription",
        users: [],
        createdAt: "2025-01-01",
        updatedAt: "2025-01-01",
      },
      {
        id: 2,
        name: "sessionName2",
        date: "2020-02-02",
        teacher_id: 2,
        description: "sessionDescription2",
        users: [],
        createdAt: "2025-02-01",
        updatedAt: "2025-02-01"
      }
    ]
  ).as("getSessionsInfo");

  //WHEN : logging in on the login page
  cy.visit("/login");
  cy.get("input[formControlName=email]").type("yoga@studio.com");
  cy.get("input[formControlName=password]").type(
    `${"test!1234"}{enter}{enter}`
  );

  //THEN : it should redirect to the sessions page and fetch the sessions
  cy.url().should("include", "/sessions");
  cy.wait("@getSessionsInfo");
});




// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
// declare namespace Cypress {
//   interface Chainable<Subject = any> {
//     customCommand(param: any): typeof customCommand;
//   }
// }
//
// function customCommand(param: any): void {
//   console.warn(param);
// }
//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);
//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
// cypress/support/commands.ts
