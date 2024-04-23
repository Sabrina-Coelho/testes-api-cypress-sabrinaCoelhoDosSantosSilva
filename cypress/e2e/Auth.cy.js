import { faker } from '@faker-js/faker'

describe('Teste Recurso Auth', function () {
  var randomPassword;


  it('Login - Sucesso', function () {
    cy.registerUser().then((fakeUserData) => {
      cy.loginUser(fakeUserData);
    })
  })


  it('Login - Email inválido', function () {
    randomPassword = faker.internet.password({ length: 6 });

    const fakeUserData = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: randomPassword
    };

    cy.request({
      method: 'POST',
      url: '/api/users',
      body: fakeUserData
    })
      .then((response) => {
        expect(response.status).to.equal(201);
      })

    cy.request({
      method: 'POST',
      url: '/api/auth/login',
      body: {
        email: 'invalidoteste.com.br',
        password: fakeUserData.password
      },
      failOnStatusCode: false
    })
      .then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message');
        const message = response.body.message
        cy.log(message);
      })
  })


  it('Login - Senha inválida', function () {
    randomPassword = faker.internet.password({ length: 6 });

    const fakeUserData = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: randomPassword
    };

    cy.request({
      method: 'POST',
      url: '/api/users',
      body: fakeUserData
    })
      .then((response) => {
        expect(response.status).to.equal(201);
      })

    cy.request({
      method: 'POST',
      url: '/api/auth/login',
      body: {
        email: fakeUserData.email,
        password: 'senhaerrada'
      },
      failOnStatusCode: false
    })
      .then((response) => {
        expect(response.status).to.equal(401);
        expect(response.body).to.have.property('message');
        const message = response.body.message
        cy.log(message);
      })
  })


  it('Login - Usuário inexistente', function () {
    randomPassword = faker.internet.password({ length: 6 });

    const fakeUserData = {
      email: faker.internet.email(),
      password: randomPassword
    };

    cy.request({
      method: 'POST',
      url: '/api/auth/login',
      body: {
        email: fakeUserData.email,
        password: fakeUserData.password
      },
      failOnStatusCode: false
    })
      .then((response) => {
        expect(response.status).to.equal(401);
        expect(response.body).to.have.property('message');
        const message = response.body.message
        cy.log(message);
      })
  })
})