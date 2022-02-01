const faker = require('faker');
export const API_ENDPOINT = Cypress.env('BACKEND_URL') || 'http://localhost:8000/api';
const email_user = faker.internet.email();
const password = '123';

describe('test login', () => {
    beforeEach(() => {
        // Cypress starts out with a blank slate for each test
        // so we must tell it to visit our website with the `cy.visit()` command.
        // Since we want to visit the same URL at the start of all our tests,
        // we include it in our beforeEach function so that it runs before each test
        cy.visit('http://localhost:3000')

        cy.intercept( API_ENDPOINT + '/login','POST').as('apiLogin');

    })

    it('displays login view by default', () => {
        // We use the `cy.get()` command to get all elements that match the selector.
        // Then, we use `should` to assert that there are two matched items,
        // which are the two default items.

        cy.get('h3').should('have.text','Login')
        const email_user = faker.internet.email();
        const password = '123';
        cy.request('POST', API_ENDPOINT + '/register',
            {
                name: `${faker.name.firstName()} ${faker.name.lastName()}`,
                email: email_user,
                password: password,
                password_confirmation : "123"
            }).then((response) => {
            // Check response
            expect(response.status).eq(200);

            cy.get('input[placeholder="Enter email"]').type(email_user);

            cy.get('input[placeholder="Enter password"]').type(password);

            cy.get('.btn').click();

            cy.wait('@apiLogin').its('response.statusCode').should('eq', 200)

            });




    })



})