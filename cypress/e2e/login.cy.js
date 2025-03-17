/// <reference types= "cypress"/>

describe('Teste de API login', () => {
  it('Deve realizar login com sucesso', () => {
    cy.request({
      method: 'POST',
      url: 'login',
      body: {
        "email": "fulano@qa.com",
        "password": "teste"
      }
    }).then((response) => {
      cy.log(response.body.authorization)
      expect(response.body.message).to.equal('Login realizado com sucesso');
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('authorization');

      // Armazena o token no Cypress.env()
      Cypress.env('token', response.body.authorization);
    });
  });
});
