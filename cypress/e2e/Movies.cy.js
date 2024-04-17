import { faker } from '@faker-js/faker'


describe('Testes Recurso Movies', function () {
  var randomPassword;

  
  it('Listar Filmes', function () {
    cy.request({
      method: 'GET',
      url: baseUrl + '/api/movies'
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
              method: 'POST',
              url: baseUrl + '/api/movies',
              body: {
                title: 'Barbie: A Princesa e a Plebéia',
                genre: 'Animação',
                description: 'Primeiro filme musical original da Barbie.',
                durationInMinutes: 85,
                releaseYear: 2004
              },
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
      url: baseUrl + '/api/movies/search',
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
        })
        cy.log(response.body);
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

                cy.request({
                  method: 'POST',
                  url: baseUrl + '/api/movies',
                  body: {
                    title: 'Barbie: A Princesa e a Plebéia',
                    genre: 'Animação',
                    description: 'Primeiro filme musical original da Barbie.',
                    durationInMinutes: 85,
                    releaseYear: 2004
                  },
                  headers: {
                    'Authorization': 'Bearer ' + accessToken
                  }
                })
                  .then((response) => {
                    expect(response.status).to.equal(201);

                    cy.request({
                      method: 'GET',
                      url: baseUrl + '/api/movies/search',
                      qs: {
                        title: 'Barbie: A Princesa e a Plebéia'
                      }
                    })
                      .then((response) => {
                        expect(response.status).to.equal(200);
                        if (response.body.length > 0) {
                          const movieId = response.body[0].id;

                          cy.request({
                            method: 'GET',
                            url: baseUrl + '/api/movies/' + movieId
                          })
                            .then((response) => {
                              expect(response.status).to.equal(200);
                              cy.log(response.body);
                            })
                        }
                      })
                  })
              })
          })
      })
  })
})