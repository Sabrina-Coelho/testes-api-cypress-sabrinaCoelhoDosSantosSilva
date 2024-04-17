import { faker } from '@faker-js/faker'

describe('Testes Recurso User', function () {
  var baseUrl;
  var randomPassword;

  beforeEach(function () {
    baseUrl = 'https://raromdb-3c39614e42d4.herokuapp.com'
  })


  it('Criar Usuário - Sucesso', function () {
    randomPassword = faker.internet.password({ length: 6 });

    const fakeUserData = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: randomPassword
    };

    cy.request({
      method: 'POST',
      url: baseUrl + '/api/users',
      body: fakeUserData
    })
      .then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body.name).to.be.a('string');
        expect(response.body.email).to.be.a('string').and.include('@');
        expect(fakeUserData.password).to.equal(randomPassword);
      })
  })


  it('Criar Usuário - Senha menor que 6', function () {
    randomPassword = faker.internet.password({ length: 5 });

    const fakeUserData = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: randomPassword
    };

    cy.request({
      method: 'POST',
      url: baseUrl + '/api/users',
      body: fakeUserData,
      failOnStatusCode: false
    })
      .then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.deep.include('password must be longer than or equal to 6 characters')
      })
  })


  it('Criar Usuário - Senha maior que 12', function () {
    randomPassword = faker.internet.password({ length: 13 });

    const fakeUserData = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: randomPassword
    };

    cy.request({
      method: 'POST',
      url: baseUrl + '/api/users',
      body: fakeUserData,
      failOnStatusCode: false
    })
      .then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.deep.include('password must be shorter than or equal to 12 characters');
      })
  })



  it('Criar Usuário - Email inválido', function () {
    randomPassword = faker.internet.password({ lenght: 6 });

    const fakeUserData = {
      name: faker.person.fullName(),
      email: 'testeqa.com.br',
      password: randomPassword
    }

    cy.request({
      method: 'POST',
      url: baseUrl + '/api/users',
      body: fakeUserData,
      failOnStatusCode: false
    })
      .then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.deep.include('email must be an email')
      })
  })


  it('Consultar Lista de Usuários', function () {
    randomPassword = faker.internet.password({ length: 6 });

    const fakeUserData = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: randomPassword
    };

    cy.request({
      method: 'POST',
      url: baseUrl + '/api/users',
      body: fakeUserData
    })
      .then((response) => {
        expect(response.status).to.equal(201);

        cy.request({
          method: 'POST',
          url: baseUrl + '/api/auth/login',
          body: {
            email: fakeUserData.email,
            password: fakeUserData.password
          }
        })
          .then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('accessToken');
            const accessToken = response.body.accessToken;
            cy.log(accessToken);
            cy.request({
              method: 'PATCH',
              url: baseUrl + '/api/users/admin',
              headers: {
                'Authorization': 'Bearer ' + accessToken
              },
            })
              .then((response) => {
                expect(response.status).to.equal(204);
              })
            cy.request({
              method: 'GET',
              url: baseUrl + '/api/users',
              headers: {
                'Authorization': 'Bearer ' + accessToken
              }
            })
              .then((response) => {
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an('array');
                response.body.forEach(user => {
                  expect(user).to.have.property('id');
                  expect(user).to.have.property('name');
                  expect(user).to.have.property('email');
                  expect(user).to.have.property('type');
                })
                cy.log(response.body);
              })
          })
      })
  })


  it('Encontrar Usuário', function () {
    randomPassword = faker.internet.password({ length: 6 });

    const fakeUserData = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: randomPassword
    };

    cy.request({
      method: 'POST',
      url: baseUrl + '/api/users',
      body: fakeUserData
    })
      .then((response) => {
        expect(response.status).to.equal(201);
        const userId = response.body.id;


        cy.request({
          method: 'POST',
          url: baseUrl + '/api/auth/login',
          body: {
            email: fakeUserData.email,
            password: fakeUserData.password
          }
        })
          .then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('accessToken');
            const accessToken = response.body.accessToken;
            cy.log(accessToken);

            cy.request({
              method: 'PATCH',
              url: baseUrl + '/api/users/admin',
              headers: {
                'Authorization': 'Bearer ' + accessToken
              }
            })
              .then((response) => {
                expect(response.status).to.equal(204);

                cy.request({
                  method: 'GET',
                  url: baseUrl + '/api/users/' + userId,
                  headers: {
                    'Authorization': 'Bearer ' + accessToken
                  }
                })
              })
              .then((response) => {
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an('object');
                expect(response.body).to.have.property('id');
                expect(response.body).to.have.property('name');
                expect(response.body).to.have.property('email');
                expect(response.body).to.have.property('type');
              })
            cy.log(response.body);
          })
      })
  })
})
