/// <reference types= "cypress"/>
import { faker } from '@faker-js/faker';

describe('Testes de API em Produtos ', () => {

    //Token dinâmico para autenticação automática (support>commands)
    let token
    beforeEach(() => {
        cy.token('fulano@qa.com', 'teste').then(tkn => {
            token = tkn
        })
    });
    it('Listar produtos - GET', () => {
        cy.request({
            method: 'GET',
            url: 'produtos'
        }).should((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('produtos');
        });
    });

    it('Cadastrar produto - POST', () => {
        // Gerar nome de produto aleatório
        let nomeProduto = `${faker.commerce.productName()}`;
        cy.request({
            method: 'POST',
            url: 'produtos',
            headers: { authorization: token },
            body: {
                "nome": nomeProduto,
                "preco": 300,
                "descricao": faker.commerce.productDescription(),
                "quantidade": 65 
            }
        }).should((response) => {
            expect(response.status).to.equal(201);
            expect(response.body.message).to.equal('Cadastro realizado com sucesso');
        });
    });

    it('Deve validar produto cadastrado recentemente', () => {
        cy.cadastrarProduto(token, 'Mouse Redragon', 213, 'Mouse', 41)
        .should((response) => {
            expect(response.status).to.equal(400);
            expect(response.body.message).to.equal('Já existe produto com esse nome');
            
        });
    });
    it('Deve editar um produto com sucesso', () => {
        // Gerar nome de produto e descrição aleatórios
        const produto = faker.commerce.productName();
        const descricao = faker.commerce.productDescription();
    
        cy.cadastrarProduto(token, produto, 213, descricao, 41)
            .then(response => {
                let id = response.body._id;
                cy.request({
                    method: 'PUT',
                    url: `produtos/${id}`,
                    headers: { authorization: token },
                    body: {
                        "nome": produto,
                        "preco": 278,
                        "descricao": "Produto Editado",  // Você pode manter essa descrição ou gerar uma nova
                        "quantidade": 99
                    }
                }).should((response) => {
                    expect(response.status).to.equal(200);
                    expect(response.body.message).to.equal('Registro alterado com sucesso');
                });
            });
    });
    
    it.only('Deve deletar um produto com sucesso', () => {
        //Cadastrar produto antes de editar
        const produtoDelete = faker.commerce.productName()
        cy.cadastrarProduto(token, produtoDelete, 100, 'Descrição do produto que vai ser deletado', 50)
            .then(response => {
                let id = response.body._id
                cy.request({
                    method: 'DELETE',
                    url: `produtos/${id}`,
                    headers:{authorization: token}
                })
            }).should((response) =>{
                expect(response.status).to.equal(200)
                expect(response.body.message).to.equal('Registro excluído com sucesso')
            })
    });
});
