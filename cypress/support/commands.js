import { faker } from '@faker-js/faker';

Cypress.Commands.add('registerUser', () => {
    const fakeUserData = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 6 })
    };

    return cy.request({
        method: 'POST',
        url: '/api/users',
        body: fakeUserData
    })
        .then((response) => {
            expect(response.status).to.equal(201);
            return fakeUserData;
        })
})

Cypress.Commands.add('loginUser', (fakeUserData) => {

    return cy.request({
        method: 'POST',
        url: '/api/auth/login',
        body: {
            email: fakeUserData.email,
            password: fakeUserData.password
        }
    })
        .then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('accessToken');
            const accessToken = response.body.accessToken;
            Cypress.env('accessToken', accessToken);
            return accessToken;
        })
})
