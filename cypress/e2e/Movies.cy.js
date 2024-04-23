import { faker } from '@faker-js/faker'


describe('Testes Recurso Movies', function () {
  var randomPassword;

  beforeEach(() => {
    cy.fixture('movie.json').as('movie');
  })

  it('Listar Filmes', function () {
    cy.request({
      method: 'GET',
      url: '/api/movies'
    })
      .then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
        response.body.forEach(movie => {
          expect(movie).to.have.property('id');
          expect(movie).to.have.property('title');
          expect(movie).to.have.property('genre');
          expect(movie).to.have.property('description');
          expect(movie).to.have.property('totalRating');
          expect(movie).to.have.property('durationInMinutes');
          expect(movie).to.have.property('releaseYear');
        })
        cy.log(response.body);
      })
  })


  it('Procurar Filmes por Título', function () {
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

        cy.request({
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
            cy.log(accessToken);

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
              })
          })

      })

    cy.request({
      method: 'GET',
      url: '/api/movies/search',
      qs: {
        title: 'Barbie: A Princesa e a Plebéia'
      }
    })
      .then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
        response.body.forEach(movie => {
          expect(movie).to.have.property('id');
          expect(movie).to.have.property('title');
          expect(movie).to.have.property('genre');
          expect(movie).to.have.property('description');
          expect(movie).to.have.property('totalRating');
          expect(movie).to.have.property('durationInMinutes');
          expect(movie).to.have.property('releaseYear');
          if (!movie.hasOwnProperty('reviews')) {
            cy.log(movie);
          }
          if (movie.reviews !== undefined) {
            expect(movie.reviews).to.be.an('array');
            expect(movie.reviews).to.be.an('array');
            movie.reviews.forEach(review => {
              expect(review).to.have.property('id');
              expect(review).to.have.property('reviewText');
              expect(review).to.have.property('reviewType');
              expect(review).to.have.property('score');
              expect(review).to.have.property('updatedAt');
              expect(review).to.have.property('user');
            })
          }
        })
      })
  })


  it('Procurar Filmes por iD', function () {
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

        cy.request({
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
            cy.log(accessToken);

            cy.request({
              method: 'PATCH',
              url: '/api/users/admin',
              headers: {
                'Authorization': 'Bearer ' + accessToken
              },
            })
              .then((response) => {
                expect(response.status).to.equal(204);

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
                    const movieId = response.body.id;

                    cy.request({
                      method: 'GET',
                      url: '/api/movies/' + movieId
                    })
                      .then((response) => {
                        expect(response.status).to.equal(200);
                        expect(response.body).to.be.an('object');
                        expect(response.body).to.have.property('id');
                        expect(response.body).to.have.property('title');
                        expect(response.body).to.have.property('genre');
                        expect(response.body).to.have.property('description');
                        expect(response.body).to.have.property('durationInMinutes');
                        expect(response.body).to.have.property('releaseYear');
                        expect(response.body).to.have.property('criticScore');
                        expect(response.body).to.have.property('audienceScore');
                        if (!response.body.hasOwnProperty('reviews')) {
                          cy.log(response.body);
                        }
                        if (response.body.reviews !== undefined) {
                          expect(response.body.reviews).to.be.an('array');
                          response.body.reviews.forEach(review => {
                            expect(review).to.have.property('id');
                            expect(review).to.have.property('reviewText');
                            expect(review).to.have.property('reviewType');
                            expect(review).to.have.property('score');
                            expect(review).to.have.property('updatedAt');
                            expect(review).to.have.property('user');
                          })
                        }
                      })
                  })
              })
          })
      })
  })


  it('Criar um Filme', function () {
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

        cy.request({
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
            cy.log(accessToken);

            cy.request({
              method: 'PATCH',
              url: '/api/users/admin',
              headers: {
                'Authorization': 'Bearer ' + accessToken
              },
            })
              .then((response) => {
                expect(response.status).to.equal(204);

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
                    expect(response.body).to.have.property('id');
                    expect(response.body).to.have.property('title');
                    expect(response.body).to.have.property('genre');
                    expect(response.body).to.have.property('description');
                    expect(response.body).to.have.property('durationInMinutes');
                    expect(response.body).to.have.property('releaseYear');
                  })
              })
          })
      })
  })

  it('Atualizar um Filme - Sucesso', function () {
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

        cy.request({
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
            cy.log(accessToken);

            cy.request({
              method: 'PATCH',
              url: '/api/users/admin',
              headers: {
                'Authorization': 'Bearer ' + accessToken
              },
            })
              .then((response) => {
                expect(response.status).to.equal(204);

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

                    cy.request({
                      method: 'PUT',
                      url: '/api/movies/' + testMovieId,
                      body: {
                        title: 'Barbie: A Princesa e a Plebéia',
                        genre: 'Animação Musical',
                        description: 'Primeiro filme musical original da Barbie. Muito bom.',
                        durationInMinutes: 85,
                        releaseYear: 2004
                      },
                      headers: {
                        'Authorization': 'Bearer ' + accessToken
                      }
                    })
                      .then((response) => {
                        expect(response.status).to.equal(204);
                      })
                  })
              })
          })
      })
  })

  it('Atualizar um Filme - Filme Não Encontrado', function () {
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

        cy.request({
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
            cy.log(accessToken);

            cy.request({
              method: 'PATCH',
              url: '/api/users/admin',
              headers: {
                'Authorization': 'Bearer ' + accessToken
              },
            })
              .then((response) => {
                expect(response.status).to.equal(204);

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

                    cy.request({
                      method: 'PUT',
                      url: '/api/movies/' + 65431321684321354651,
                      body: {
                        title: 'Barbie: A Princesa e a Plebéia',
                        genre: 'Animação Musical',
                        description: 'Primeiro filme musical original da Barbie. Muito bom.',
                        durationInMinutes: 85,
                        releaseYear: 2004
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
  })
})



