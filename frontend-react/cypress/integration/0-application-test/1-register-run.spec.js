const faker = require('faker');
export const API_ENDPOINT = Cypress.env('BACKEND_URL') || 'http://localhost:8000/api';

describe('test register', () => {
    beforeEach(() => {
        // Cypress starts out with a blank slate for each test
        // so we must tell it to visit our website with the `cy.visit()` command.
        // Since we want to visit the same URL at the start of all our tests,
        // we include it in our beforeEach function so that it runs before each test
        cy.visit('http://localhost:3000/register')


    })

    it('displays login view by default', () => {
        // We use the `cy.get()` command to get all elements that match the selector.
        // Then, we use `should` to assert that there are two matched items,
        // which are the two default items.
        cy.get('h3').should('have.text','Sign Up')
    })

    it('displays error when submit button with empty fields', () => {
        // We use the `cy.get()` command to get all elements that match the selector.
        // Then, we use `should` to assert that there are two matched items,
        // which are the two default items.
        cy.get('.btn').click();
        cy.get('.alert-danger').should('have.text','Invalid data send')
    })

    it('register user', () => {
        // We use the `cy.get()` command to get all elements that match the selector.
        // Then, we use `should` to assert that there are two matched items,
        // which are the two default items.

        cy.intercept( API_ENDPOINT + '/register','POST').as('apiRegister');
        
        cy.get('input[placeholder="First name"]').type(`${faker.name.firstName()} ${faker.name.firstName()}`);

        cy.get('input[placeholder="Last name"]').type(`${faker.name.firstName()} ${faker.name.lastName()}`);

        cy.get('input[placeholder="Enter email"]').type(`${faker.internet.email()}`);

        cy.get('input[placeholder="Enter password"]').type('123');

        cy.get('input[placeholder="Confirmation password"]').type('123');

        cy.get('.btn').click();

        cy.wait('@apiRegister').its('response.statusCode').should('eq', 200)

        cy.get('h3').should('have.text','Login')

    })

})