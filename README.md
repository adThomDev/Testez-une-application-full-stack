# Testez une application full stack, OpenClassrooms - projet n°5

## Table of Contents

* [Summary](#summary)
* [Ressources](#ressources)
    * [MySQL](#sql-script)
    * [Postman collection](#postman-collection)
* [Frontend](#frontend)
    * [Launch the frontend part](#launch-the-frontend-part)
    * [Frontend testing](#frontend-testing)
        * [E2E](#e2e)
        * [Unit tests](#unit-tests)
* [Backend](#backend)
    * [Launch the backend part](#launch-the-backend-part)
    * [Backend testing](#backend-testing)

## Summary

This proect contains both the frontend and backend code for an app called Yoga, which allows users to register and login onto an app to manage yoga sessions.

# Ressources

### SQL script

An SQL script to populate the database is available at `ressources/sql/script.sql`

Among other entries, It'll generate a default admin account :
- login: yoga@studio.com
- password: test!1234

### Postman collection

For Postman import the collection

> ressources/postman/yoga.postman_collection.json

by following the documentation:

https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-data-into-postman

# Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.1.0.
Testing frameworks : Jest and Cypress.

## Launch the frontend part

Clone the project :

> git clone https://github.com/adThomDev/Testez-une-application-full-stack.git

Go inside the front folder :

> cd front

Install dependencies :

> npm install

Launch the frontend :

> ng serve

### Frontend testing

#### E2E

Launching e2e test :

> npm run e2e

Generate coverage report (you should launch e2e test before) :

> npm run e2e:coverage

Report is available here :

> front/coverage/lcov-report/index.html

#### Unit tests

Launching test :

> npm run test

for following change :

> npm run test:watch

# Backend

This project uses Java 11

## Launch the backend part

Testing framework : JUnit 5, JaCoCo

Go inside the back folder :

> cd back

Install dependencies :

> mvn clean install

### Backend testing

To launch and generate the JaCoCo code coverage :

> mvn clean test