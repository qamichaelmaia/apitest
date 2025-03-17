/// <reference types= "cypress"/>
import { faker } from "@faker-js/faker";
describe("Testes de API em Usuarios ", () => {
    let token;
    beforeEach(() => {
        cy.token("fulano@qa.com", "teste").then((tkn) => {
            token = tkn;
        });
    });
    it("Listar usuarios - GET", () => {
        cy.request({
            method: "GET",
            url: "usuarios",
        }).should((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property("usuarios");
        });
    });

    it("Buscar usuarios por Id - GET", () => {
        const userId = "0uxuPY0cbmQhpEz1";
        cy.request({
            method: "GET",
            url: `usuarios/${userId}`,
        }).should((response) => {
            expect(response.status).to.equal(200);
        });
    });

    it("Deve validar usuário cadastrado recentemente - POST", () => {
        cy.cadastrarUsuario(token, "Carmine Pacocha", "Noel.Klocko@yahoo.com", "teste")
        .should((response) => {
            expect(response.status).to.equal(400);
        });
    });

    it("Cadastrar novo usuario - POST", () => {
        let nomeUser = `${faker.name.firstName()} ${faker.name.lastName()}`;
        let emailUser = faker.internet.email();
        cy.request({
            method: "POST",
            url: "usuarios",
            body: {
                nome: nomeUser,
                email: emailUser,
                password: "teste",
                administrador: "true",
            },
        }).should((response) => {
            expect(response.status).to.equal(201);
        });
    });
});
