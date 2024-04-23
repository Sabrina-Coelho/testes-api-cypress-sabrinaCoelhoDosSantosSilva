import { faker } from '@faker-js/faker'

describe('Testes Recurso User', function () {
  var randomPassword;

  beforeEach(() => {
    cy.fixture('movie.json').as('movie');
  })

  it('Criar Usuário - Sucesso', function () {
    cy.registerUser();
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
      url: '/api/users',
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
      url: '/api/users',
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
      url: '/api/users',
      body: fakeUserData,
      failOnStatusCode: false
    })
      .then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.deep.include('email must be an email')
      })
  })

  it('Consultar Lista de Usuários - Sucesso', function () {
    cy.registerUser().then((fakeUserData) => {
      cy.loginUser(fakeUserData);

      cy.loginUser(fakeUserData).then((accessToken) => {
        cy.request({
          method: 'PATCH',
          url: '/api/users/admin',
          headers: {
              'Authorization': 'Bearer ' + accessToken
          },
      })
          .then((response) => {
              expect(response.status).to.equal(204);
          })

      cy.loginUser(fakeUserData).then((accessToken) => {
      cy.request({
        method: 'GET',
        url: '/api/users',
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
  })

it('Consultar Lista de Usuários - Não Autorizado', function () {
  cy.request({
    method: 'GET',
    url: '/api/users',
    failOnStatusCode: false
  })
    .then((response) => {
      expect(response.status).to.equal(401);
    })

  it('Encontrar Usuário', function () {
    cy.registerUser().then((fakeUserData) => {
      cy.loginUser(fakeUserData);

      cy.loginUser(fakeUserData).then((accessToken) => {
        cy.request({
          method: 'PATCH',
          url: '/api/users/admin',
          headers: {
              'Authorization': 'Bearer ' + accessToken
          },
      })
          .then((response) => {
              expect(response.status).to.equal(204);
          })
    })

      cy.loginUser(fakeUserData).then((accessToken) => {
      cy.request({
        method: 'GET',
        url: '/api/users/' + userId,
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

it('Criação de Review - Sucesso', function () {
  cy.registerUser().then((fakeUserData) => {
    cy.loginUser(fakeUserData);

    cy.loginUser(fakeUserData).then((accessToken) => {
      cy.request({
        method: 'PATCH',
        url: '/api/users/admin',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
    })
        .then((response) => {
            expect(response.status).to.equal(204);
        })

    cy.loginUser(fakeUserData).then((accessToken) => {
    cy.request({
      method: 'POST',
      url: '/api/movies',
      body: this.movie,
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    })
      .then((response) => {
        expect(response.status).to.equal(201);
        cy.log(response.body);
        const testMovieId = response.body.id;

        cy.loginUser(fakeUserData).then((accessToken) => {
          cy.request({
            method: 'POST',
            url: 'api/users/review',
            body: {
              movieId: testMovieId,
              score: 5,
              reviewText: 'Ótimo musical, amo muito.'
            },
            headers: {
              'Authorization': 'Bearer ' + accessToken
            }
          })
            .then((response) => {
              expect(response.status).to.equal(201);
              cy.log(response.body);
            })
        })
      })
    })
  })
})
})

it('Criação de Review - Filme Não Encontrado', function () {
  cy.registerUser().then((fakeUserData) => {
    cy.loginUser(fakeUserData);

    cy.loginUser(fakeUserData).then((accessToken) => {
      cy.request({
        method: 'PATCH',
        url: '/api/users/admin',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
    })
        .then((response) => {
            expect(response.status).to.equal(204);
        })

    cy.loginUser(fakeUserData).then((accessToken) => {
    cy.request({
      method: 'POST',
      url: 'api/users/review',
      body: {
        movieId: 46541321354532132,
        score: 5,
        reviewText: 'Ótimo musical, amo muito.'
      },
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      failOnStatusCode: false
    })
      .then((response) => {
        expect(response.status).to.equal(404);
        cy.log(response.body);
      })
    })
  })
})
})

it('Listar Reviews', function () {
  cy.registerUser().then((fakeUserData) => {
    cy.loginUser(fakeUserData);

    cy.loginUser(fakeUserData).then((accessToken) => {
    cy.request({
      method: 'PATCH',
      url: '/api/users/admin',
      headers: {
          'Authorization': 'Bearer ' + accessToken
      },
  })
      .then((response) => {
          expect(response.status).to.equal(204);
      })

    cy.loginUser(fakeUserData).then((accessToken) => {
  cy.request({
    method: 'POST',
    url: '/api/movies',
    body: this.movie,
    headers: {
      'Authorization': 'Bearer ' + accessToken
    }
  })
    .then((response) => {
      expect(response.status).to.equal(201);
      cy.log(response.body);
      const testMovieId = response.body.id;

      cy.loginUser(fakeUserData).then((accessToken) => {
        cy.request({
          method: 'POST',
          url: 'api/users/review',
          body: {
            movieId: testMovieId,
            score: 5,
            reviewText: 'Ótimo musical, amo muito.'
          },
          headers: {
            'Authorization': 'Bearer ' + accessToken
          }
        })
          .then((response) => {
            expect(response.status).to.equal(201);

            cy.loginUser(fakeUserData).then((accessToken) => {
              cy.request({
                method: 'GET',
                url: '/api/users/review/all',
                headers: {
                  'Authorization': 'Bearer ' + accessToken
                }
              })
                .then((response) => {
                  expect(response.status).to.equal(200);
                  expect(response.body).to.be.an('array');
                  response.body.forEach(review => {
                    expect(review).to.have.property('id');
                    expect(review).to.have.property('movieId');
                    expect(review).to.have.property('movieTitle');
                    expect(review).to.have.property('score');
                    expect(review).to.have.property('reviewText');
                    expect(review).to.have.property('reviewType');
                  })
                  cy.log(response.body);
                })
            })
          })
        })
      })
      })
    })
  })
})
})







